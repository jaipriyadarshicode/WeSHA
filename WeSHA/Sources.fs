namespace WeSHA

open WebSharper
open WebSharper.Community.Dashboard


[<JavaScript>]
type MQTTRunner =
 {
        MQTTName:string
        OutPortKey:string
 }
 static member Create mqttKey = {
                                                MQTTName = "MQTT"
                                                OutPortKey=System.Guid.NewGuid().ToString()
                                               }
 static member FromPorts = (fun worker -> {
                                             OutPortKey=worker.OutPorts.[0].Key
                                             MQTTName = worker.Name.Value
                                          })
 interface IWorkerContext with
    override x.Name = x.MQTTName
    override x.InPorts =  []  |> Ports.Create 
    override x.OutPorts = [OutPort.CreateNumber x.OutPortKey "Value"]
 interface IRunner with
        override x.Run= (fun worker -> None)




