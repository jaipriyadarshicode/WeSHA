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
        |AppLib(src) -> src |> AppModelLib.ToWorker
        |MQTTSource(src) -> Worker.CreateWithRunner src

    static member FromWorker (worker:Worker)= 
        match worker |> AppModelLib.FromWorker with
        |Some(appModel) -> Some(AppLib(appModel))
        |_ -> match worker.DataContext  with 
              | :? MQTTRunner as src ->  Some(MQTTSource(MQTTRunner.FromWorker worker))
              |_ -> None //failwith("AllTypes FromWorker unknown type")

[<JavaScript>]          
module AppWeSHA =
    let Register dashboard = 
         MQTTRunner.Create "" |> App.RegisterEventGeneral dashboard AppModel.FromWorker AppModel.ToWorker
         dashboard
         //WebSharper.Community.Dashboard.App.Register  AppModel.FromWorker AppModel.ToWorker dashboard

    let CreateDashboard =
        let dashboard = App.CreateDashboard  AppModel.FromWorker AppModel.ToWorker
        dashboard |> Register
