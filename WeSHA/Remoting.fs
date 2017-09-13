namespace WeSHA

open WebSharper


open System
open System.IO
open System.Collections.Generic
open RabbitMQ.Client
open RabbitMQ.Client.Events
open System.Text
open WebSharper
open WebSharper.Community.Suave.WebSocket.Server
open WebSharper.Community.Dashboard

module Server =
    let log = Environment.Log

    type [<JavaScript; NamedUnionCases>]
        C2SMessage =
        | RequestRefresh of str: string    
    and [<JavaScript; NamedUnionCases "type">]
        S2CMessage =
        | RegisterMQTTEvent of string


    /// The agent that stores currently running websocket connections:

    type ConnectionsAgentMessage =
        | ClientConnected of (S2CMessage -> Async<unit>) * AsyncReplyChannel<System.Guid>
        | ClientDisconnected of System.Guid
        | ProcessMQTTEvent of (string*MessageBus.Value)
        | UpdateWorkers of Worker list
        | Broadcast of S2CMessage
    type ServerState =
        {
            Connections:Map<Guid,(S2CMessage -> Async<unit>)>
            Events:Worker list
            Data:AppData<AppModel>
        }
        static member empty =
            {
                Connections=Map.empty
                Events=[]
                Data = AppData<AppModel>.empty()
            }
    let ConnectionsAgent = MailboxProcessor<ConnectionsAgentMessage>.Start(fun inbox ->
        let rec loop state = async {
            let! message = inbox.Receive()
            match message with
            | ClientConnected (onNotification, chan) ->
                let id = System.Guid.NewGuid()
                chan.Reply id
                return! loop {state with Connections=(Map.add id onNotification (state.Connections))}
            | ClientDisconnected id ->
                return! loop {state with Connections=(Map.remove id (state.Connections))}
            | UpdateWorkers (workers) ->  return! loop {state with Events=workers}

            | ProcessMQTTEvent (queue,value) ->
                try
                    let checkEvent (worker:Worker) = worker.Data :? MQTTRunner && worker.InPorts.[0].String = queue
                    let events = 
                        match state.Events |> List.tryFind checkEvent with
                        |None -> inbox.Post(Broadcast(RegisterMQTTEvent(queue)))
                                 let newEvent=MQTTSource(MQTTRunner.Create queue) |> AppModel.ToWorker
                                 newEvent.WithKey(queue)::state.Events
                        |Some(_) -> state.Events
                    events|> List.filter checkEvent |> List.iter (fun event -> event.OutPorts.[0].Trigger value) 
                    return! loop {state with Events=events}
                with 
                |ex -> ex.Message |> log
                       return! loop state
            | Broadcast notification ->
                // Using Async.Start here instead of awaiting with do!
                // because we don't want to delay this agent while broadcasting the notification.
                do (state.Connections)
                    |> Seq.map (fun (KeyValue(_, f)) -> async {
                        try 
                            return! f notification
                        with e ->
                            // Maybe the client disconnected in the meantime, or something.
                            // You may want to log the error.
                            Console.WriteLine("Error sending message:"+ e.Message)
                            ()
                    })
                    |> Async.Parallel
                    |> Async.Ignore
                    |> Async.Start
                return! loop state
        }
        loop ServerState.empty
    )
    let recreateOnServer (data:AppData<AppModel>) = 
        let workers = data.RecreateOnServer (Json.Serialize<AppData<AppModel>> data) (AppModel.ToWorker:AppModel->Worker)
        ConnectionsAgent.Post(UpdateWorkers(workers))

    let processQueueMessage queue (message:string) =
        try
            let value = System.Double.Parse(message)
            ConnectionsAgent.Post(ProcessMQTTEvent(queue,MessageBus.Number(value)))
        with
        | ex -> Console.WriteLine(ex.Message)
    let configPath() = Path.Combine(Environment.DataDirectory,"Default.cfg")
    let Start : StatefulAgent<S2CMessage, C2SMessage, int> =
        Console.WriteLine("Start")
        Console.WriteLine("Try to load configuration from:"+configPath())
        if File.Exists(configPath()) then 
            let json = System.IO.File.ReadAllText(configPath())
            let data = Json.Deserialize<AppData<AppModel>> json
            Console.WriteLine("OK")
            data |> recreateOnServer |> ignore
//            ConnectionsAgent.Post (UpdateConfiguration(data))
        let dprintfn x =
            Printf.ksprintf (fun s ->
                System.Diagnostics.Debug.WriteLine s
                stdout.WriteLine s
            ) x
        fun (client:WebSocketClient<S2CMessage,C2SMessage>) -> async {
            //let clientIp = client.Connection.Context.Request.RemoteIpAddress
            Console.WriteLine("Client connected") //: " + clientIp)
            let notify x = client.PostAsync x // or whatever you want to do when receiving a notification.
            let connectionId = ConnectionsAgent.PostAndReply (fun chan -> ClientConnected(notify, chan))
            return 0, fun state msg -> async {
                match msg with
                | Close -> ConnectionsAgent.Post (ClientDisconnected connectionId)
                           dprintfn "Closed connection"// to %s" clientIp
                           return state
                | Error e -> dprintfn "Error in WebSocket server connected" // to %s: %s" clientIp e.Message
                             return state
                | Message m -> Console.WriteLine(m)
                               return state + 1
                }
         }
      
    [<Rpc>]
    let Upload (data:AppData<AppModel>) = 
        System.Diagnostics.Debug.WriteLine("!!! Server.Upload "+Environment.DataDirectory)

        let json = Json.Serialize<AppData<AppModel>> data
        configPath() |> log
        System.IO.File.WriteAllText(configPath(),json)
        data |> recreateOnServer
        