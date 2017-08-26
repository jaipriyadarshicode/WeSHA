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
    static member ToWorker (appData:AppModel) = 
        match appData with 
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
              | :? MQTTRunner as src ->  MQTTSource(MQTTRunner.FromWorker worker)
              |_ -> failwith("AllTypes FromWorker unknown type")

[<JavaScript>]          
module App =
    let Register dashboard = 
        WebSharper.Community.Dashboard.App.Register dashboard

    let CreateDashboard =
        let dashboard = WebSharper.Community.Dashboard.App.CreateDashboard
        dashboard |> Register 
        dashboard