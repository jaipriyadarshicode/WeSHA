namespace WeSHA

open WebSharper
open WebSharper.JavaScript
open WebSharper.UI.Next
open WebSharper.UI.Next.Client
open WebSharper.Community.Dashboard
open WebSharper.Community.Panel


[<JavaScript>]
type AppModel =
    |AppLib of AppModelLib
    |MQTTSource of MQTTRunner
    member x.Worker =
        match x with 
        |AppLib(src) -> src.Worker
        |MQTTSource(src) -> Worker.CreateWithRunner src

    static member FromDataContext (data:IWorkerContext)=
        match data |> AppModelLib.FromDataContext with
        |Some(appModel) -> AppLib(appModel)
        |_ -> match data with 
              | :? MQTTRunner as src -> MQTTSource(src)
              |_ -> failwith("AllTypes FromDataContext unknown type")
    static member FromWorker (worker:Worker)= 
        match worker |> AppModelLib.FromWorker with
        |Some(appModel) -> AppLib(appModel)
        |_ -> match worker.DataContext  with 
              | :? MQTTRunner as src ->  MQTTSource(MQTTRunner.FromPorts worker)
              |_ -> failwith("AllTypes FromWorker unknown type")
(*
[<JavaScript>]
type AppModel =
    |MQTTSource of MQTTRunner
    |RandomSource of RandomRunner
    |OpenWeatherSource of OpenWeatherRunner
    |TextWidget   of TextBoxRenderer
    |ChartWidget  of ChartRenderer
    member x.Worker =
        match x with 
        |MQTTSource(src) -> Worker.CreateWithRunner src
        |RandomSource(src) -> Worker.CreateWithRunner src
        |OpenWeatherSource(src) -> Worker.CreateWithRunner src
        |TextWidget(src)   -> Worker.CreateWithRenderer src
        |ChartWidget(src)  -> Worker.Create(src).WithRunner(src).WithRenderer(src)

    static member FromDataContext (data:IWorkerContext)=
        match data with
        | :? MQTTRunner    as src -> MQTTSource(src)
        | :? RandomRunner    as src -> RandomSource(src)
        | :? OpenWeatherRunner as src -> OpenWeatherSource(src)
        | :? TextBoxRenderer as src -> TextWidget(src)
        | :? ChartRenderer   as src -> ChartWidget(src)
        | _ -> failwith("AllTypes FromDataContext unknown type") 

         
    static member FromWorker (worker:Worker)= 
                            match worker.DataContext with
                            | :? MQTTRunner    as src -> MQTTSource(MQTTRunner.FromPorts worker)
                            | :? RandomRunner    as src -> RandomSource(RandomRunner.FromPorts worker)
                            | :? OpenWeatherRunner as src -> OpenWeatherSource(OpenWeatherRunner.FromPorts worker)
                            | :? TextBoxRenderer as src -> TextWidget(TextBoxRenderer.FromPorts worker)
                            | :? ChartRenderer   as src -> ChartWidget(ChartRenderer.FromPorts worker)
                            | _ -> failwith("AllTypes FromDataContext unknown type") 
    static member ToWorker data = (data |> AppModel.FromDataContext).Worker
    *)

[<JavaScript>]          
module App =
    let Register dashboard = 
        WebSharper.Community.Dashboard.App.Register dashboard

    let CreateDashboard =
        let dashboard = WebSharper.Community.Dashboard.App.CreateDashboard
        dashboard |> Register 
        dashboard