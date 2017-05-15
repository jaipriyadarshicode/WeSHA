namespace WeSHA

open WebSharper
open WebSharper.Sitelets
open WebSharper.UI.Next
open WebSharper.UI.Next.Server

type EndPoint =
    | [<EndPoint "/">] Home
    | [<EndPoint "/about">] About

module Templating =
    open WebSharper.UI.Next.Html

    type MainTemplate = Templating.Template<"Main.html">

    // Compute a menubar where the menu item for the given endpoint is active
    let MenuBar (ctx: Context<EndPoint>) endpoint : Doc list =
        let ( => ) txt act =
             liAttr [if endpoint = act then yield attr.``class`` "active"] [
                aAttr [attr.href (ctx.Link act)] [text txt]
             ]
        [
            li ["Home" => EndPoint.Home]
            li ["About" => EndPoint.About]
        ]

    let Main ctx action (title: string) (body: Doc list) =
        Content.Page(
            MainTemplate()
                .Title(title)
                .MenuBar(MenuBar ctx action)
                .Body(body)
                .Doc()
        )

module Site =
    open WebSharper.UI.Next.Html
    open WebSharper.Community.Suave.WebSocket

    let HomePage ctx ep=
        Templating.Main ctx EndPoint.Home "Home" [
            div [client <@ Client.Main(ep) @>]
        ]

    let AboutPage ctx =
        Templating.Main ctx EndPoint.About "About" [
            h1 [text "About"]
            p [text "This is a template WebSharper client-server application."]
        ]

    let Main ep=
        Application.MultiPage (fun ctx endpoint ->
            match endpoint with
            | EndPoint.Home -> HomePage ctx ep
            | EndPoint.About -> AboutPage ctx
        )
module SelfHostedServer =
    open WebSharper.Community.Suave.WebSocket
    open WebSharper.Suave
    open Suave.Http
    open Suave.Web
    open Suave.WebPart
    open Suave.WebSocket
    open Suave.Filters
    open Suave.RequestErrors
    open Suave.Operators

    open System
    open System.Text
    open System.Net
    open System.Net.Sockets
    open RabbitMQ.Client
    open RabbitMQ.Client.Events

    [<EntryPoint>]
    let Main args =
        let ipAddress=
            Dns.GetHostAddresses(Dns.GetHostName())
            |>Seq.filter (fun ip->ip.AddressFamily = AddressFamily.InterNetwork)
            |>Seq.last
        let defIPAddress=ipAddress.ToString()
        let ipServer, ipAMQP =
            match args with
            | [| ipServer; ipAMQP |] -> ipServer, ipAMQP
            | [| |] -> defIPAddress, "192.168.2.116"
            | _ -> eprintfn "Usage: WeSHA IP_SERVER IP_AMQP "; exit 1
        Console.WriteLine("ipServer:"+ipServer+" ipAMQP:"+ipAMQP)
        let factory = new ConnectionFactory(HostName = ipAMQP, UserName="guest1",Password="guest1")
        //let factory = new ConnectionFactory(HostName = "localhost", UserName="guest1",Password="guest1")
        let connection = factory.CreateConnection()
        let channel = connection.CreateModel()
        channel.ExchangeDeclare("topic_logs","topic")
        let queue="mqtt-subscription-MQTToolqos1"
        channel.QueueDeclare(queue=queue, durable= true, exclusive= false, autoDelete= true, arguments= null) |>ignore
        //channel.QueueDeclare() |>ignore
        //let queueName = channel.QueueDeclare().QueueName
        channel.QueueBind(queue= queue, exchange= "amq.topic", routingKey= "#");
        let consumer = new EventingBasicConsumer(channel)
        consumer.Received.AddHandler((fun model ea ->
                                let body = ea.Body
                                let message = Encoding.UTF8.GetString(body)
                                Console.WriteLine(" [x] Received {0}  {1}",ea.RoutingKey, message)
                                Server.processQueueMessage ea.RoutingKey message
                        )) 
        //channel.BasicConsume(queue= "mqtt-subscription-MQTToolqos1", noAck= true, consumer= consumer)  |>ignore
        channel.BasicConsume(queue=queue, noAck= true, consumer= consumer)  |>ignore



        let ep = Endpoint.Create("http://" + ipServer + ":9000/", "/websocket", JsonEncoding.Readable)
        let proc=ProcessorCreater.Create(ep,Server.Start)

        let config={defaultConfig with bindings =[HttpBinding.createSimple HTTP ipServer 9000 ]}

        let appSuave = 
          choose [
            path "/websocket" >=> handShake proc.Listen
            WebSharperAdapter.ToWebPart (Site.Main ep, RootDirectory = @"../..") 
            //GET >=> choose [ path "/" >=> file "index.html"; browseHome ]
            NOT_FOUND "Found no handlers." ]
        do
            startWebServer
                config
                appSuave
        0

