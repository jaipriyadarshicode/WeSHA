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
open WebSharper.Charting
open WebSharper.ChartJs

// A to-do list application, showcasing time-varying collections of elements.
// See this live at http://intellifactory.github.io/websharper.ui.next/#TodoList.fs !

[<JavaScript>]
module Client =

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
            let data = [for x in 0.0 .. 9.0 -> (0.0)]
            {   
                Key=Key.Fresh();
                queue = q;
                value = Var.Create 0.0;
                source=Event<double>()
                values = let queue=Queue<double>()
                         data|>Seq.iter (fun entry -> queue.Enqueue(entry))
                         queue
                chart = Charting.Chart.Line(data)
            }
        member x.UpdateValue value=
            x.value.Value<-value
            x.values.Enqueue(value)
            if x.values.Count > 10 then
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
        Renderers.ChartJs.Render(chart, (* Config = c, *) Window = 10)
 (*   let updateLineChart (chart:Charts.LineChart) value = 
        let nEntries=chart.DataSet.JS|>Seq.length
        let listData=chart.DataSet|>Seq.l
        chart.DataSet
        |>Seq.iteri (fun (ind,entry) ->chart.UpdateData(ind,if ind = listData.Count-9 then value else snd listData[ind])|>ignore) *)

        
    let RenderHAItem (haItem:HAMessageItem) =
        tr [
            td [
                   divAttr [attr.``class`` "bigvalue"] [
                        textView  (haItem.value.View |> View.Map (fun s -> s.ToString()))
                   ]
            ]
            td [
                   //renderChart haItem.source
                   Renderers.ChartJs.Render(haItem.chart (*, Size = Size(500, 350)*))
            ]

        ]
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
                                                                    let haItem=
                                                                        match haItems.HAItems.TryFind (fun item->item.queue = queue) with
                                                                        | None -> let newItem=HAMessageItem.Create queue
                                                                                  haItems.HAItems.Add  newItem
                                                                                  Console.Log ("New item")
                                                                                  newItem
                                                                        | Some(found)->found
                                                                    Console.Log ("Value added:"+value.ToString())
                                                                    haItem.UpdateValue value
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
    let Main (endpoint : Endpoint<Server.S2CMessage, Server.C2SMessage>) =
        let status = h1 []
        procSockets  endpoint status
        let listMessages=
            ListModel.View haItems.HAItems
            |> Doc.BindSeqCachedBy (fun m -> m.Key) (RenderHAItem)
        TodoExample (div[
                          status                        
                          listMessages
                        ])


    let Description () =
        div [
            text "A to-do list application."
        ]

