(function()
{
 "use strict";
 var Global,WeSHA,Client,HAMessageItem,HAModel,SC$1,WeSHA_JsonEncoder,WeSHA_JsonDecoder,IntelliFactory,Runtime,WebSharper,UI,Next,Var,Seq,List,Operators,Key,Control,FSharpEvent,Charting,Chart,Doc,Concurrency,Community,Suave,WebSocket,Client$1,WithEncoding,AttrProxy,View,Renderers,ChartJs,LiveChart,ListModel,Json,Provider;
 Global=window;
 WeSHA=Global.WeSHA=Global.WeSHA||{};
 Client=WeSHA.Client=WeSHA.Client||{};
 HAMessageItem=Client.HAMessageItem=Client.HAMessageItem||{};
 HAModel=Client.HAModel=Client.HAModel||{};
 SC$1=Global.StartupCode$WeSHA$Client=Global.StartupCode$WeSHA$Client||{};
 WeSHA_JsonEncoder=Global.WeSHA_JsonEncoder=Global.WeSHA_JsonEncoder||{};
 WeSHA_JsonDecoder=Global.WeSHA_JsonDecoder=Global.WeSHA_JsonDecoder||{};
 IntelliFactory=Global.IntelliFactory;
 Runtime=IntelliFactory&&IntelliFactory.Runtime;
 WebSharper=Global.WebSharper;
 UI=WebSharper&&WebSharper.UI;
 Next=UI&&UI.Next;
 Var=Next&&Next.Var;
 Seq=WebSharper&&WebSharper.Seq;
 List=WebSharper&&WebSharper.List;
 Operators=WebSharper&&WebSharper.Operators;
 Key=Next&&Next.Key;
 Control=WebSharper&&WebSharper.Control;
 FSharpEvent=Control&&Control.FSharpEvent;
 Charting=WebSharper&&WebSharper.Charting;
 Chart=Charting&&Charting.Chart;
 Doc=Next&&Next.Doc;
 Concurrency=WebSharper&&WebSharper.Concurrency;
 Community=WebSharper&&WebSharper.Community;
 Suave=Community&&Community.Suave;
 WebSocket=Suave&&Suave.WebSocket;
 Client$1=WebSocket&&WebSocket.Client;
 WithEncoding=Client$1&&Client$1.WithEncoding;
 AttrProxy=Next&&Next.AttrProxy;
 View=Next&&Next.View;
 Renderers=Charting&&Charting.Renderers;
 ChartJs=Renderers&&Renderers.ChartJs;
 LiveChart=Charting&&Charting.LiveChart;
 ListModel=Next&&Next.ListModel;
 Json=WebSharper&&WebSharper.Json;
 Provider=Json&&Json.Provider;
 HAMessageItem=Client.HAMessageItem=Runtime.Class({
  UpdateValue:function(value)
  {
   var $this,v,a;
   $this=this;
   Var.Set(this.value,value);
   this.values.push(value);
   this.values.length>10?v=this.values.shift():void 0;
   a=function(ind,entry)
   {
    return $this.chart.__UpdateData(ind,function()
    {
     return entry;
    });
   };
   (function(s)
   {
    Seq.iteri(a,s);
   }(this.values));
   this.source.event.Trigger(value);
  }
 },null,HAMessageItem);
 HAMessageItem.Create=function(q)
 {
  var data,queue,a;
  data=List.ofSeq(Seq.delay(function()
  {
   return Seq.map(function()
   {
    return 0;
   },Operators.range(0,9));
  }));
  return HAMessageItem.New(Key.Fresh(),q,Var.Create$1(0),new FSharpEvent.New(),(queue=[],(a=function(entry)
  {
   queue.push(entry);
  },function(s)
  {
   Seq.iter(a,s);
  }(data),queue)),Chart.Line(data));
 };
 HAMessageItem.New=function(Key$1,queue,value,source,values,chart)
 {
  return new HAMessageItem({
   Key:Key$1,
   queue:queue,
   value:value,
   source:source,
   values:values,
   chart:chart
  });
 };
 HAModel.New=function(HAItems)
 {
  return{
   HAItems:HAItems
  };
 };
 Client.Description=function()
 {
  var a;
  a=[Doc.TextNode("A to-do list application.")];
  return Doc.Element("div",[],a);
 };
 Client.Main=function(endpoint)
 {
  var status,listMessages,a;
  status=Doc.Element("h1",[],[]);
  Client.procSockets(endpoint,status);
  listMessages=(a=function(m)
  {
   return m.Key;
  },function(a$1)
  {
   return Doc.ConvertBy(a,Client.RenderHAItem,a$1);
  }(Client.haItems().HAItems.v));
  return Client.TodoExample(Doc.Element("div",[],[status,listMessages]));
 };
 Client.procSockets=function(endpoint,status)
 {
  var a;
  a=Concurrency.Delay(function()
  {
   var x;
   x=WithEncoding.ConnectStateful(function(x$1)
   {
    return Global.JSON.stringify((WeSHA_JsonEncoder.j())(x$1));
   },function(x$1)
   {
    return(WeSHA_JsonDecoder.j())(Global.JSON.parse(x$1));
   },endpoint,function()
   {
    return Concurrency.Delay(function()
    {
     return Concurrency.Return([0,function(state)
     {
      return function(msg)
      {
       return Concurrency.Delay(function()
       {
        var data,a$1,value,queue,haItem,m,newItem,b;
        return msg.$==3?(Global.console.log("Connection closed."),Concurrency.Return(state)):msg.$==2?(Global.console.log("WebSocket connection open."),Concurrency.Return(state)):msg.$==1?(Global.console.log("WebSocket connection error!"),Concurrency.Return(state)):(data=msg.$0,(a$1=data.$==0?(value=data.$0[1],(queue=data.$0[0],(Global.console.log("Message received:"+queue+" "+Global.String(value)),haItem=(m=Client.haItems().HAItems.TryFind(function(item)
        {
         return item.queue===queue;
        }),(m!=null?m.$==1:false)?m.$0:(newItem=HAMessageItem.Create(queue),(Client.haItems().HAItems.Append(newItem),Global.console.log("New item"),newItem))),Global.console.log("Value added:"+Global.String(value)),haItem.UpdateValue(value),Concurrency.Return(null)))):(status.SetText(Global.String(state)+data.$0),Concurrency.Return(null)),(b=Concurrency.Delay(function()
        {
         return Concurrency.Return(state+1);
        }),Concurrency.Combine(a$1,b))));
       });
      };
     }]);
    });
   });
   return Concurrency.Bind(x,function()
   {
    return Concurrency.Return(null);
   });
  });
  Concurrency.Start(a,null);
 };
 Client.RenderHAItem=function(haItem)
 {
  var a,a$1,a$2,a$3,a$4;
  a=[(a$1=[(a$2=[AttrProxy.Create("class","bigvalue")],(a$3=[Doc.TextView(View.Map(Global.String,haItem.value.v))],Doc.Element("div",a$2,a$3)))],Doc.Element("td",[],a$1)),(a$4=[ChartJs.Render$5(haItem.chart,null,null,null)],Doc.Element("td",[],a$4))];
  return Doc.Element("tr",[],a);
 };
 Client.renderChart=function(src)
 {
  var chart;
  chart=LiveChart.Line(src.event).__WithTitle("");
  return ChartJs.Render$5(chart,null,null,{
   $:1,
   $0:10
  });
 };
 Client.haItems=function()
 {
  SC$1.$cctor();
  return SC$1.haItems;
 };
 Client.TodoExample=function(insert)
 {
  var a,a$1;
  a=[AttrProxy.Create("class","table table-hover")];
  a$1=[Doc.Element("tbody",[],[insert])];
  return Doc.Element("table",a,a$1);
 };
 SC$1.$cctor=Runtime.Cctor(function()
 {
  var a;
  SC$1.haItems=HAModel.New((a=new List.T({
   $:0
  }),ListModel.Create(function(item)
  {
   return item.Key;
  },a)));
  SC$1.$cctor=Global.ignore;
 });
 WeSHA_JsonEncoder.j=function()
 {
  return WeSHA_JsonEncoder._v?WeSHA_JsonEncoder._v:WeSHA_JsonEncoder._v=(Provider.EncodeUnion(void 0,{
   str:0
  },[["RequestRefresh",[["$0","str",Provider.Id(),0]]]]))();
 };
 WeSHA_JsonDecoder.j=function()
 {
  return WeSHA_JsonDecoder._v?WeSHA_JsonDecoder._v:WeSHA_JsonDecoder._v=(Provider.DecodeUnion(void 0,"type",[["queue_value",[["$0","Item",Provider.DecodeTuple([Provider.Id(),Provider.Id()]),0]]],["string",[["$0","value",Provider.Id(),0]]]]))();
 };
}());
