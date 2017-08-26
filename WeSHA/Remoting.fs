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
        | [<Name "queue_value">] ResponseValue of (string*double)
        | [<Name "string">] ResponseString of value: string
        | NewConfiguration of AppData<AppModel>
        | RegisterMQTTEvent of string


    /// The agent that stores currently running websocket connections:

    type ConnectionsAgentMessage =
        | ClientConnected of (S2CMessage -> Async<unit>) * AsyncReplyChannel<System.Guid>
        | ClientDisconnected of System.Guid
        | ProcessMQTTEvent of (string*MessageBus.Value)
        | UpdateConfiguration of AppData<AppModel>
        | GetConfiguration of (AsyncReplyChannel<AppData<AppModel>>)
        | Broadcast of S2CMessage
    //let queueMsg=Queue<S2CMessage>()
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
            | GetConfiguration (channel) -> 
                channel.Reply(state.Data)
                return! loop state
            | UpdateConfiguration (data) -> inbox.Post(Broadcast (NewConfiguration(data)))
                                            let events=data.RecreateOnServer AppModel.ToWorker
                                            return! loop {state with Data=data; Events = events}
            | ProcessMQTTEvent (queue,value) ->
                match state.Events |> List.tryFind (fun worker -> worker.DataContext :? MQTTRunner && worker.InPorts.[0].String = queue) with
                |None -> inbox.Post(Broadcast(RegisterMQTTEvent(queue)))
                |Some(_) -> ()
                MessageBus.Agent.Post(MessageBus.Send(MessageBus.CreateMessage queue value))
                let newEvent=MQTTSource(MQTTRunner.Create queue) |> AppModel.ToWorker
                return! loop {state with Events=newEvent.WithKey(queue)::state.Events}
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
    let processQueueMessage queue (message:string) =
        try
            let value = System.Double.Parse(message)
            let srvMessage=ResponseValue (queue,value)


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
            ConnectionsAgent.Post (UpdateConfiguration(data))
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
    let UploadClientConfig (data:AppData<AppModel>)=
        ConnectionsAgent.Post (UpdateConfiguration(data))
        if Directory.Exists(Environment.DataDirectory) then
            let json = Json.Serialize<AppData<AppModel>> data
            System.IO.File.WriteAllText(configPath(),json)
            sprintf "Configuration was written to %s:" (configPath()) |> log
            
    [<Rpc>]
    let GetConfiguration () = 
        ConnectionsAgent.PostAndReply(fun r -> GetConfiguration(r))        