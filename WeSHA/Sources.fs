namespace WeSHA

open WebSharper
open WebSharper.Community.Dashboard


[<JavaScript>]
type MQTTRunner =
 {
        Name:string
        MQTTKey:MessageBus.Message
        OutPortKey:string
 }
 static member Create (mqttKey:string) =  
                                 let index = mqttKey.IndexOf(".")
                                 let name = if index < 0 then "MQTT" else mqttKey.Substring(index+1)
                                 {
                                        Name = name
                                        MQTTKey = MessageBus.CreateString mqttKey
                                        OutPortKey=mqttKey
                                  }
 static member FromPorts = (fun worker -> {
                                             MQTTKey = worker.InPorts.[0].PortValue.Value
                                             OutPortKey=worker.InPorts.[0].PortValue.Value.Value.AsString
                                             Name = worker.Name.Value
                                          })
 interface IWorkerContext with
    override x.Name = x.Name
    override x.InPorts =  ["MQTTKey",x.MQTTKey]  |> Ports.Create 
    override x.OutPorts = [OutPort.CreateNumber x.OutPortKey "Value"]
 interface IRunner with
        override x.Run= (fun worker -> None)




