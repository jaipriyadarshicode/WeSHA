﻿namespace WeSHA

open WebSharper
open WebSharper.Community.Dashboard


[<JavaScript>]
type MQTTRunner =
 {
        MQTTRunnerData:WorkerData
 }
 static member Create (mqttKey:string) =  
                                 let index = mqttKey.IndexOf(".")
                                 let name = if index < 0 then "MQTT" else mqttKey.Substring(index+1)
                                 {
                                          MQTTRunnerData = WorkerData.Create name [("MQTTKey",MessageBus.StringMessage mqttKey)] [("Value",MessageBus.NumberMessage 0.0)]
                                  }
 static member FromWorker = (fun (worker:Worker) -> {MQTTRunnerData = worker.ToData })
 interface IWorkerContext with
    override x.Data = x.MQTTRunnerData
 interface IRunner with
        override x.Run= (fun worker -> None)




