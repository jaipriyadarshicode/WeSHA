namespace WeSHA

open System.Collections.Generic
open WebSharper
open WebSharper.JavaScript
open WebSharper.UI.Next
open WebSharper.UI.Next.Client
open WebSharper.UI.Next.Html
open WebSharper.UI.Next.Notation
open WebSharper.Community.Suave.WebSocket
open WebSharper.Community.Suave.WebSocket.Client
open WebSharper.Community.Panel
open WebSharper.Community.Dashboard
open WebSharper.Charting
open WebSharper.ChartJs


[<JavaScript>]
[<Require(typeof<WebSharper.Community.PropertyGrid.Resources.StyleResource>)>]
[<Require(typeof<WebSharper.Community.Panel.Resources.StyleResource>)>]
[<Require(typeof<WebSharper.Community.Dashboard.Resources.StyleResource>)>]
module Client =

    Environment.Log <- (fun str -> Console.Log(str))
    let log str = str |> Environment.Log
    let dashboard = AppWeSHA.CreateDashboard
    MessageBus.RunServerRequests()
    Environment.UpdateConfiguration <- (fun json -> 
                                                try
                                                    let data = Json.Deserialize<AppData<AppModel>> json
                                                    data.RecreateOnClientEventsNotRunning dashboard (App.PanelContainerCreator) 
                                                                                (AppModel.ToWorker:AppModel->Worker)
                                                    "Configuration updated" |> log
                                                with
                                                |ex -> ex.Message |> log
                                       )
    if dashboard.Data.EventGroups.Length = 0 then
        dashboard.Restore (App.PanelContainerCreator) [("MQTT",[])] [] [] |> ignore

    let processQueueMessage_new queue value = 
        let source = 
            let allEvents = dashboard.Data.EventGroups |> List.ofSeq |> List.map (fun gr -> gr.EventItems |> List.ofSeq) |> List.concat
            match allEvents |> List.tryFind (fun item->
                                                        Console.Log ("Try find: " + item.Worker.Key + " " + queue)
                                                        item.Worker.Key = queue
                                                        ) with
            | None -> 
                      let worker = MQTTSource(MQTTRunner.Create queue) |> AppModel.ToWorker  
                      let gr = dashboard.Data.EventGroups |> List.ofSeq |> List.head            
                      dashboard.Data.RegisterEvent queue gr worker
                      worker
            | Some(found)->found.Worker
        //Console.Log ("Value added:"+source.OutPorts.[0].Name + " " + value.ToString())
        source.OutPorts.[0].Trigger value

    // ...and run it.
    let procSockets (endpoint : Endpoint<Server.S2CMessage, Server.C2SMessage>) (status:Elt) =
        async {
            let! server =
                ConnectStateful endpoint (fun server -> async {
                    return 0, fun state msg -> async {
                        match msg with
                        | Message data ->
                            match data with
                            | Server.RegisterMQTTEvent (queue) ->
                                                      log "RegisterMQTTEvent" 
                                                      let worker = MQTTSource(MQTTRunner.Create queue) |> AppModel.ToWorker   
                                                      let gr = dashboard.Data.EventGroups |> List.ofSeq |> List.head            
                                                      dashboard.Data.RegisterEvent queue gr worker
                            return (state + 1)
                        | Close ->
                            Console.Log "Connection closed."
                            return state
                        | Open ->
                            Console.Log "WebSocket connection open."
                            return state
                        | Error ->
                            Console.Log "WebSocket connection error!"
                            return state
                    }
                } )
            ()
        
        }
        |> Async.Start    


    let Main (endpoint) =
        let status = h1 []
        procSockets  endpoint status

        let tbCellC content =td content
        let menu =
           div[
            tbCellC[Helper.TxtIconNormal "autorenew" "Refresh" (fun _ ->  
                                          let data = AppData<AppModel>.Create dashboard (AppModel.FromWorker)
                                          data.RecreateOnClientEventsRunning 
                                           dashboard (App.PanelContainerCreator) 
                                           (AppModel.ToWorker:AppModel->Worker)
                                          )]

            tbCellC[Helper.TxtIconNormal "archive" "Upload" (fun _ ->  
                                          let data =  AppData<AppModel>.Create dashboard (AppModel.FromWorker)
                                          Server.Upload(data)
                                    )]
          ]

        div[
                     status                        
                     dashboard.Render menu
           ]





