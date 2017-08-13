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
module Client =
    let chartBufferSize=50
    // Finally, we put it all together...
    let TodoExample insert =
        tableAttr [attr.``class`` "table table-hover"] [
            tbody [
                insert
            ]
        ]
    type HAMessageItem =
        {
            Key:Key
            queue : string
            value :Var<double>
            source : Event<double>
            values : Queue<double>
            chart : Charts.LineChart
        }

        static member Create q=
            let data = [for x in 0 .. chartBufferSize-1 -> (0.0)]
            {   
                Key=Key.Fresh();
                queue = q;
                value = Var.Create 0.0;
                source=Event<double>()
                values = let queue=Queue<double>()
                         data|>Seq.iter (fun entry -> queue.Enqueue(entry))
                         queue
                chart = Charting.Chart.Line(data).WithFillColor(Color.Name "white");
            }
        member x.UpdateValue value=
            x.value.Value<-value
            x.values.Enqueue(value)
            if x.values.Count > chartBufferSize then
                x.values.Dequeue()|>ignore
            x.values|>Seq.iteri (fun ind entry -> x.chart.UpdateData(ind, fun e -> entry))
            x.source.Trigger value
    type HAModel =
        {
            HAItems : ListModel<Key,HAMessageItem>
        }
    let haItems=  { HAItems = ListModel.Create (fun item ->item.Key) [] }
    let renderChart (src:Event<double>)= 
        let chart = LiveChart.Line(src.Publish)
        //let c = ChartJs.LineChartConfiguration()
        Renderers.ChartJs.Render(chart(* , Config = c, Window = 10*) )
    let mutable clientWidth = 0.0
    let RenderHAItem (haItem:HAMessageItem) =    
        let renderChart =     
            Console.Log ("renderChart:"+clientWidth.ToString())
            Renderers.ChartJs.Render(haItem.chart , Size = Size((int)(clientWidth*3.0/4.0), 200))
        tr [
            div[
                divAttr [attr.``class`` "rectangle"][
                    td [
                           divAttr [attr.``class`` "bigvalue"] [
                                textView  (haItem.value.View |> View.Map (fun s -> s.ToString()))
                           ]
                    ]
                    td [
                            divAttr [attr.``class`` "chart"]
                           //renderChart haItem.source
                           [  
                             renderChart
                           ]
                    ]
                 ]
             ]
        ]
    let dashboard = App.CreateDashboard

    let processQueueMessage_new queue value = 
        let source = 
            match dashboard.Data.EventItems.TryFind (fun item->
                                                        Console.Log ("Try find: " + item.Worker.Key + " " + queue)
                                                        item.Worker.Key = queue
                                                        ) with
            | None -> 
                      let worker = MQTTSource(MQTTRunner.Create queue).Worker                    
                      dashboard.Data.RegisterEvent queue worker
                      worker
            | Some(found)->found.Worker
        //Console.Log ("Value added:"+source.OutPorts.[0].Name + " " + value.ToString())
        source.OutPorts.[0].Trigger value

    let processQueueMessage queue value = 
        let haItem=
            match haItems.HAItems.TryFind (fun item->item.queue = queue) with
            | None -> let newItem=HAMessageItem.Create queue
                      haItems.HAItems.Add  newItem
                      Console.Log ("New item")
                      newItem
            | Some(found)->found
        Console.Log ("Value added:"+value.ToString())
        haItem.UpdateValue value
    // ...and run it.
    let procSockets (endpoint : Endpoint<Server.S2CMessage, Server.C2SMessage>) (status:Elt) =
        async {
            let! server =
                ConnectStateful endpoint (fun server -> async {
                    return 0, fun state msg -> async {
                        match msg with
                        | Message data ->
                            match data with
                            | Server.ResponseString x ->  status.Text <-  (state.ToString() + x)
                            | Server.ResponseValue (queue,value) -> Console.Log ("Message received:" + queue+" " + value.ToString())
                                                                    processQueueMessage_new queue (MessageBus.Number(value))
                                                                    //haItem.source.Trigger value
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


    //let srcRandom = RandomValueSource.Create :> ISource
    //dashboard.RegisterSource srcRandom 

    let Main (endpoint : Endpoint<Server.S2CMessage, Server.C2SMessage>) =
        let status = h1 []
        procSockets  endpoint status
        let listMessages=
            ListModel.View haItems.HAItems
            |> Doc.BindSeqCachedBy (fun m -> m.Key) (RenderHAItem)

        div[
                     status                        
                     listMessages
                     dashboard.Render
           ].OnAfterRender(fun (el) -> 
                               clientWidth <- el.ClientWidth
                               (*
                               let cx = 800.0 - 15.0
                               let createPanel fnc =
                                   let clientContainer = dashboard.CreatePanel(cx,fnc)
                                   Widgets.text srcRandom |> dashboard.RegisterReceiver clientContainer 
                                   let receiver = Widgets.chart srcRandom ((int)(cx - 270.0)) 120
                                   receiver |> dashboard.RegisterReceiver clientContainer 
                               createPanel(fun _ -> createPanel(fun _->())) *)

                               async {
                                   Console.Log "Server.GetAllChannels()"
                                   let! allQueues=Server.GetAllChannels("bla")
                                   allQueues
                                   |>Array.iter (fun queue -> async {let! values = Server.GetValues queue chartBufferSize 
                                                                     values |>Array.iter (fun value -> Console.Log "old value"
                                                                                                       processQueueMessage queue value)
                                                                     }|>Async.Start)
                                                             // values |>Array.iter (fun value -> processQueueMessage queue value))
                               }|> Async.Start

                          )





