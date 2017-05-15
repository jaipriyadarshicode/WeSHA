namespace WeSHA

open WebSharper


open System
open System.Collections.Generic
open RabbitMQ.Client
open RabbitMQ.Client.Events
open System.Text
open WebSharper
open WebSharper.Community.Suave.WebSocket.Server

module Server =


    type [<JavaScript; NamedUnionCases>]
        C2SMessage =
        | RequestRefresh of str: string    
    and [<JavaScript; NamedUnionCases "type">]
        S2CMessage =
        | [<Name "queue_value">] ResponseValue of (string*double)
        | [<Name "string">] ResponseString of value: string

   // type GlobalNotification = string // or whatever you need to broadcast to all clients.

    /// The agent that stores currently running websocket connections:

    type ConnectionsAgentMessage =
        | ClientConnected of (S2CMessage -> Async<unit>) * AsyncReplyChannel<System.Guid>
        | ClientDisconnected of System.Guid
        | Broadcast of S2CMessage
    let queueMsg=Queue<S2CMessage>()

    [<Rpc>]
    let GetAllChannels (input:string) =
        async {
            return
                queueMsg.ToArray()
                |> Array.map (fun entry -> match entry with
                                           | ResponseValue (key,value) -> key)
                |> Array.distinct
        }
    [<Rpc>]
    let GetValues (queue:string) count=
        async {
                let queueStart=queue.Substring(0,queue.Length-3)
                let res=
                    queueMsg.ToArray()
                    |> Array.map (fun entry -> match entry with
                                               | ResponseValue (key,value) -> (key,value))
                    |>Array.filter (fun (key,value) -> key.StartsWith(queueStart))
                    |>Array.map (fun (key,value) -> value)
                    |>Array.skip (max 0 (queueMsg.Count - count))
                    |>Array.take(min count queueMsg.Count)
                return res

        }

    let ConnectionsAgent = MailboxProcessor<ConnectionsAgentMessage>.Start(fun inbox ->
        let rec loop connections = async {
            let! message = inbox.Receive()
            match message with
            | ClientConnected (onNotification, chan) ->
                let id = System.Guid.NewGuid()
                chan.Reply id
                return! loop (Map.add id onNotification connections)
            | ClientDisconnected id ->
                return! loop (Map.remove id connections)
            | Broadcast notification ->
                // Using Async.Start here instead of awaiting with do!
                // because we don't want to delay this agent while broadcasting the notification.
                do connections
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
                return! loop connections
        }
        loop Map.empty
    )
    let processQueueMessage queue (message:string) =
        try
            let srvMessage=ResponseValue (queue,System.Double.Parse(message))
            ConnectionsAgent.Post (Broadcast srvMessage)
            queueMsg.Enqueue(srvMessage)
            if queueMsg.Count > 1000 then 
                queueMsg.Dequeue()|>ignore
        with
        | ex -> Console.WriteLine(ex.Message)

    let Start : StatefulAgent<S2CMessage, C2SMessage, int> =
        Console.WriteLine("Start")
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