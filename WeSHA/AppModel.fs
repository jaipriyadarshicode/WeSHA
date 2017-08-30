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
        |MQTTSource(src) -> Worker.Create src

    static member FromWorker (worker:Worker)= 
        match worker |> AppModelLib.FromWorker with
        |Some(appModel) -> Some(AppLib(appModel))
        |_ -> match worker.Data  with 
              | :? MQTTRunner as src ->  Some(MQTTSource(MQTTRunner.FromWorker worker))
              |_ -> None 

[<JavaScript>]          
module AppWeSHA =

    let CreateDashboard =
        let dashboard = App.CreateDashboard

        MQTTRunner.Create "" |> App.RegisterEventGeneral dashboard

        dashboard
