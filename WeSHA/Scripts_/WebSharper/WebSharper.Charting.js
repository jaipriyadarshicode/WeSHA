(function()
{
 "use strict";
 var Global,WebSharper,Charting,Pervasives,Color,Seq,Reactive,Charts,DataType,ChartConfig,SeriesChartConfig,ColorConfig,PolarData,LineChart,BarChart,RadarChart,PolarAreaChart,PieChart,DoughnutChart,CompositeChart,Chart,LiveChart,SC$1,Renderers,ChartJsInternal,BatchUpdater,ChartJs,SC$2,IntelliFactory,Runtime,Seq$1,List,Reactive$1,Reactive$2,Util,Control,FSharpEvent,Random,Ref,Operators,Arrays,Slice,Option,UI,Next,AttrProxy,AttrModule,Doc;
 Global=window;
 WebSharper=Global.WebSharper=Global.WebSharper||{};
 Charting=WebSharper.Charting=WebSharper.Charting||{};
 Pervasives=Charting.Pervasives=Charting.Pervasives||{};
 Color=Pervasives.Color=Pervasives.Color||{};
 Seq=Pervasives.Seq=Pervasives.Seq||{};
 Reactive=Pervasives.Reactive=Pervasives.Reactive||{};
 Charts=Charting.Charts=Charting.Charts||{};
 DataType=Charts.DataType=Charts.DataType||{};
 ChartConfig=Charts.ChartConfig=Charts.ChartConfig||{};
 SeriesChartConfig=Charts.SeriesChartConfig=Charts.SeriesChartConfig||{};
 ColorConfig=Charts.ColorConfig=Charts.ColorConfig||{};
 PolarData=Charts.PolarData=Charts.PolarData||{};
 LineChart=Charts.LineChart=Charts.LineChart||{};
 BarChart=Charts.BarChart=Charts.BarChart||{};
 RadarChart=Charts.RadarChart=Charts.RadarChart||{};
 PolarAreaChart=Charts.PolarAreaChart=Charts.PolarAreaChart||{};
 PieChart=Charts.PieChart=Charts.PieChart||{};
 DoughnutChart=Charts.DoughnutChart=Charts.DoughnutChart||{};
 CompositeChart=Charts.CompositeChart=Charts.CompositeChart||{};
 Chart=Charting.Chart=Charting.Chart||{};
 LiveChart=Charting.LiveChart=Charting.LiveChart||{};
 SC$1=Global.StartupCode$WebSharper_Charting$Charts=Global.StartupCode$WebSharper_Charting$Charts||{};
 Renderers=Charting.Renderers=Charting.Renderers||{};
 ChartJsInternal=Renderers.ChartJsInternal=Renderers.ChartJsInternal||{};
 BatchUpdater=ChartJsInternal.BatchUpdater=ChartJsInternal.BatchUpdater||{};
 ChartJs=Renderers.ChartJs=Renderers.ChartJs||{};
 SC$2=Global.StartupCode$WebSharper_Charting$Renderers=Global.StartupCode$WebSharper_Charting$Renderers||{};
 IntelliFactory=Global.IntelliFactory;
 Runtime=IntelliFactory&&IntelliFactory.Runtime;
 Seq$1=WebSharper&&WebSharper.Seq;
 List=WebSharper&&WebSharper.List;
 Reactive$1=IntelliFactory&&IntelliFactory.Reactive;
 Reactive$2=Reactive$1&&Reactive$1.Reactive;
 Util=WebSharper&&WebSharper.Util;
 Control=WebSharper&&WebSharper.Control;
 FSharpEvent=Control&&Control.FSharpEvent;
 Random=WebSharper&&WebSharper.Random;
 Ref=WebSharper&&WebSharper.Ref;
 Operators=WebSharper&&WebSharper.Operators;
 Arrays=WebSharper&&WebSharper.Arrays;
 Slice=WebSharper&&WebSharper.Slice;
 Option=WebSharper&&WebSharper.Option;
 UI=WebSharper&&WebSharper.UI;
 Next=UI&&UI.Next;
 AttrProxy=Next&&Next.AttrProxy;
 AttrModule=Next&&Next.AttrModule;
 Doc=Next&&Next.Doc;
 Color=Pervasives.Color=Runtime.Class({
  toString:function()
  {
   var f;
   return this.$==1?this.$0:this.$==2?this.$0:((((f=function($1,$2,$3,$4,$5)
   {
    return $1("rgba("+Global.String($2)+", "+Global.String($3)+", "+Global.String($4)+", "+$5.toFixed(6)+")");
   },(Runtime.Curried(f,5))(Global.id))(this.$0))(this.$1))(this.$2))(this.$3);
  }
 },null,Color);
 Seq.headOption=function(s)
 {
  return Seq$1.isEmpty(s)?null:{
   $:1,
   $0:Seq$1.nth(0,s)
  };
 };
 Reactive.SequenceOnlyNew=function(streams)
 {
  var m;
  m=List.ofSeq(streams);
  return m.$==1?Reactive.sequence(Reactive$2.Select(m.$0,function(v)
  {
   return[v];
  }),m.$1):Reactive$2.Return([]);
 };
 Reactive.sequence=function(acc,a)
 {
  var xs,x;
  while(true)
   if(a.$==1)
    {
     xs=a.$1;
     x=a.$0;
     acc=(function(acc$1,x$1)
     {
      return function(f)
      {
       return Reactive$2.CombineLast(acc$1,x$1,function($1,$2)
       {
        return(f($1))($2);
       });
      };
     }(acc,x))(function(o)
     {
      return function(c)
      {
       return Seq$1.append(o,[c]);
      };
     });
     a=xs;
    }
   else
    return acc;
 };
 Pervasives.withIndex=function(s)
 {
  return Seq$1.zip(Seq$1.initInfinite(Global.String),s);
 };
 Pervasives.streamWithLabel=function(stream)
 {
  var i;
  i=Reactive$2.Aggregate(stream,[0,0],function($1,$2)
  {
   return(function(t)
   {
    var s;
    s=t[0];
    return function(c)
    {
     return[s+1,c];
    };
   }($1))($2);
  });
  return function(f)
  {
   return Reactive$2.Select(i,f);
  }(function(t)
  {
   return[Global.String(t[0]),t[1]];
  });
 };
 DataType.Map=function(fn,dt)
 {
  return dt.$==1?{
   $:1,
   $0:Reactive$2.Select(dt.$0,fn)
  }:{
   $:0,
   $0:Seq$1.map(fn,dt.$0)
  };
 };
 ChartConfig.New=function(Title)
 {
  return{
   Title:Title
  };
 };
 SeriesChartConfig.New=function(XAxis,YAxis,FillColor,StrokeColor)
 {
  return{
   XAxis:XAxis,
   YAxis:YAxis,
   FillColor:FillColor,
   StrokeColor:StrokeColor
  };
 };
 ColorConfig.New=function(PointColor,PointHighlightFill,PointHighlightStroke,PointStrokeColor)
 {
  return{
   PointColor:PointColor,
   PointHighlightFill:PointHighlightFill,
   PointHighlightStroke:PointHighlightStroke,
   PointStrokeColor:PointStrokeColor
  };
 };
 PolarData.New=function(Value,Color$1,Highlight,Label)
 {
  return{
   Value:Value,
   Color:Color$1,
   Highlight:Highlight,
   Label:Label
  };
 };
 LineChart=Charts.LineChart=Runtime.Class({
  __WithPointStrokeColor:function(color)
  {
   return this.WebSharper_Charting_Charts_IColorChart_1$WithPointStrokeColor(color);
  },
  WithPointHighlightStroke:function(color)
  {
   return this.WebSharper_Charting_Charts_IColorChart_1$WithPointHighlightStroke(color);
  },
  __WithPointHighlightFill:function(color)
  {
   return this.WebSharper_Charting_Charts_IColorChart_1$WithPointHighlightFill(color);
  },
  __WithPointColor:function(color)
  {
   return this.WebSharper_Charting_Charts_IColorChart_1$WithPointColor(color);
  },
  get__ColorConfig:function()
  {
   return this.WebSharper_Charting_Charts_IColorChart_1$get_ColorConfig();
  },
  __WithStrokeColor:function(color)
  {
   return this.WebSharper_Charting_Charts_ISeriesChart_1$WithStrokeColor(color);
  },
  __WithFillColor:function(color)
  {
   return this.WebSharper_Charting_Charts_ISeriesChart_1$WithFillColor(color);
  },
  __WithYAxis:function(yAxis)
  {
   return this.WebSharper_Charting_Charts_ISeriesChart_1$WithYAxis(yAxis);
  },
  __WithXAxis:function(xAxis)
  {
   return this.WebSharper_Charting_Charts_ISeriesChart_1$WithXAxis(xAxis);
  },
  get__SeriesConfig:function()
  {
   return this.WebSharper_Charting_Charts_ISeriesChart_1$get_SeriesConfig();
  },
  __WithTitle:function(title)
  {
   return this.WebSharper_Charting_Charts_IChart_1$WithTitle(title);
  },
  get__Config:function()
  {
   return this.WebSharper_Charting_Charts_IChart_1$get_Config();
  },
  __UpdateData:function(data,props)
  {
   this.WebSharper_Charting_Charts_IMutableChart_2$UpdateData(data,props);
  },
  get_DataSet:function()
  {
   return this.dataset;
  },
  WebSharper_Charting_Charts_IColorChart_1$WithPointStrokeColor:function(color)
  {
   var i;
   return new LineChart.New(this.dataset,this.cfg,this.scfg,(i=this.ccfg,ColorConfig.New(i.PointColor,i.PointHighlightFill,i.PointHighlightStroke,color)));
  },
  WebSharper_Charting_Charts_IColorChart_1$WithPointHighlightStroke:function(color)
  {
   var i;
   return new LineChart.New(this.dataset,this.cfg,this.scfg,(i=this.ccfg,ColorConfig.New(i.PointColor,i.PointHighlightFill,color,i.PointStrokeColor)));
  },
  WebSharper_Charting_Charts_IColorChart_1$WithPointHighlightFill:function(color)
  {
   var i;
   return new LineChart.New(this.dataset,this.cfg,this.scfg,(i=this.ccfg,ColorConfig.New(i.PointColor,color,i.PointHighlightStroke,i.PointStrokeColor)));
  },
  WebSharper_Charting_Charts_IColorChart_1$WithPointColor:function(color)
  {
   var i;
   return new LineChart.New(this.dataset,this.cfg,this.scfg,(i=this.ccfg,ColorConfig.New(color,i.PointHighlightFill,i.PointHighlightStroke,i.PointStrokeColor)));
  },
  WebSharper_Charting_Charts_IColorChart_1$get_ColorConfig:function()
  {
   return this.ccfg;
  },
  WebSharper_Charting_Charts_ISeriesChart_1$WithStrokeColor:function(color)
  {
   var i;
   return new LineChart.New(this.dataset,this.cfg,(i=this.scfg,SeriesChartConfig.New(i.XAxis,i.YAxis,i.FillColor,color)),this.ccfg);
  },
  WebSharper_Charting_Charts_ISeriesChart_1$WithFillColor:function(color)
  {
   var i;
   return new LineChart.New(this.dataset,this.cfg,(i=this.scfg,SeriesChartConfig.New(i.XAxis,i.YAxis,color,i.StrokeColor)),this.ccfg);
  },
  WebSharper_Charting_Charts_ISeriesChart_1$WithYAxis:function(yAxis)
  {
   var i;
   return new LineChart.New(this.dataset,this.cfg,(i=this.scfg,SeriesChartConfig.New(i.XAxis,yAxis,i.FillColor,i.StrokeColor)),this.ccfg);
  },
  WebSharper_Charting_Charts_ISeriesChart_1$WithXAxis:function(xAxis)
  {
   var i;
   return new LineChart.New(this.dataset,this.cfg,(i=this.scfg,SeriesChartConfig.New(xAxis,i.YAxis,i.FillColor,i.StrokeColor)),this.ccfg);
  },
  WebSharper_Charting_Charts_ISeriesChart_1$get_SeriesConfig:function()
  {
   return this.scfg;
  },
  WebSharper_Charting_Charts_IChart_1$WithTitle:function(title)
  {
   return new LineChart.New(this.dataset,ChartConfig.New(title),this.scfg,this.ccfg);
  },
  WebSharper_Charting_Charts_IChart_1$get_Config:function()
  {
   return this.cfg;
  },
  WebSharper_Charting_Charts_IMutableChart_2$OnUpdate:function(fn)
  {
   Util.addListener(this.event.event,fn);
  },
  WebSharper_Charting_Charts_IMutableChart_2$UpdateData:function(data,props)
  {
   this.event.event.Trigger([data,props]);
  }
 },null,LineChart);
 LineChart.New=Runtime.Ctor(function(dataset,cfg,scfg,ccfg)
 {
  this.dataset=dataset;
  this.cfg=cfg;
  this.scfg=scfg;
  this.ccfg=ccfg;
  this.event=new FSharpEvent.New();
 },LineChart);
 BarChart=Charts.BarChart=Runtime.Class({
  __WithStrokeColor:function(color)
  {
   return this.cst(this).WebSharper_Charting_Charts_ISeriesChart_1$WithStrokeColor(color);
  },
  __WithFillColor:function(color)
  {
   return this.cst(this).WebSharper_Charting_Charts_ISeriesChart_1$WithFillColor(color);
  },
  __WithYAxis:function(yAxis)
  {
   return this.cst(this).WebSharper_Charting_Charts_ISeriesChart_1$WithYAxis(yAxis);
  },
  __WithXAxis:function(xAxis)
  {
   return this.cst(this).WebSharper_Charting_Charts_ISeriesChart_1$WithXAxis(xAxis);
  },
  __WithTitle:function(title)
  {
   return this.cst(this).WebSharper_Charting_Charts_IChart_1$WithTitle(title);
  },
  get__SeriesConfig:function()
  {
   return this.cst(this).WebSharper_Charting_Charts_ISeriesChart_1$get_SeriesConfig();
  },
  get__Config:function()
  {
   return this.cst(this).WebSharper_Charting_Charts_IChart_1$get_Config();
  },
  __UpdateData:function(data,props)
  {
   this.WebSharper_Charting_Charts_IMutableChart_2$UpdateData(data,props);
  },
  cst:Global.id,
  get_DataSet:function()
  {
   return this.dataset;
  },
  WebSharper_Charting_Charts_ISeriesChart_1$WithStrokeColor:function(color)
  {
   var i;
   return new BarChart.New(this.dataset,this.cfg,(i=this.scfg,SeriesChartConfig.New(i.XAxis,i.YAxis,i.FillColor,color)));
  },
  WebSharper_Charting_Charts_ISeriesChart_1$WithFillColor:function(color)
  {
   var i;
   return new BarChart.New(this.dataset,this.cfg,(i=this.scfg,SeriesChartConfig.New(i.XAxis,i.YAxis,color,i.StrokeColor)));
  },
  WebSharper_Charting_Charts_ISeriesChart_1$WithYAxis:function(yAxis)
  {
   var i;
   return new BarChart.New(this.dataset,this.cfg,(i=this.scfg,SeriesChartConfig.New(i.XAxis,yAxis,i.FillColor,i.StrokeColor)));
  },
  WebSharper_Charting_Charts_ISeriesChart_1$WithXAxis:function(xAxis)
  {
   var i;
   return new BarChart.New(this.dataset,this.cfg,(i=this.scfg,SeriesChartConfig.New(xAxis,i.YAxis,i.FillColor,i.StrokeColor)));
  },
  WebSharper_Charting_Charts_IChart_1$WithTitle:function(title)
  {
   return new BarChart.New(this.dataset,ChartConfig.New(title),this.scfg);
  },
  WebSharper_Charting_Charts_ISeriesChart_1$get_SeriesConfig:function()
  {
   return this.scfg;
  },
  WebSharper_Charting_Charts_IChart_1$get_Config:function()
  {
   return this.cfg;
  },
  WebSharper_Charting_Charts_IMutableChart_2$OnUpdate:function(fn)
  {
   Util.addListener(this.event.event,fn);
  },
  WebSharper_Charting_Charts_IMutableChart_2$UpdateData:function(data,props)
  {
   this.event.event.Trigger([data,props]);
  }
 },null,BarChart);
 BarChart.New=Runtime.Ctor(function(dataset,cfg,scfg)
 {
  this.dataset=dataset;
  this.cfg=cfg;
  this.scfg=scfg;
  this.event=new FSharpEvent.New();
 },BarChart);
 RadarChart=Charts.RadarChart=Runtime.Class({
  __WithPointStrokeColor:function(color)
  {
   return this.WebSharper_Charting_Charts_IColorChart_1$WithPointStrokeColor(color);
  },
  WithPointHighlightStroke:function(color)
  {
   return this.WebSharper_Charting_Charts_IColorChart_1$WithPointHighlightStroke(color);
  },
  __WithPointHighlightFill:function(color)
  {
   return this.WebSharper_Charting_Charts_IColorChart_1$WithPointHighlightFill(color);
  },
  __WithPointColor:function(color)
  {
   return this.WebSharper_Charting_Charts_IColorChart_1$WithPointColor(color);
  },
  get__ColorConfig:function()
  {
   return this.WebSharper_Charting_Charts_IColorChart_1$get_ColorConfig();
  },
  __WithStrokeColor:function(color)
  {
   return this.WebSharper_Charting_Charts_ISeriesChart_1$WithStrokeColor(color);
  },
  __WithFillColor:function(color)
  {
   return this.WebSharper_Charting_Charts_ISeriesChart_1$WithFillColor(color);
  },
  __WithYAxis:function(yAxis)
  {
   return this.WebSharper_Charting_Charts_ISeriesChart_1$WithYAxis(yAxis);
  },
  __WithXAxis:function(xAxis)
  {
   return this.WebSharper_Charting_Charts_ISeriesChart_1$WithXAxis(xAxis);
  },
  get__SeriesConfig:function()
  {
   return this.WebSharper_Charting_Charts_ISeriesChart_1$get_SeriesConfig();
  },
  __WithTitle:function(title)
  {
   return this.WebSharper_Charting_Charts_IChart_1$WithTitle(title);
  },
  get__Config:function()
  {
   return this.WebSharper_Charting_Charts_IChart_1$get_Config();
  },
  __UpdateData:function(data,props)
  {
   this.WebSharper_Charting_Charts_IMutableChart_2$UpdateData(data,props);
  },
  get_DataSet:function()
  {
   return this.dataset;
  },
  WebSharper_Charting_Charts_IColorChart_1$WithPointStrokeColor:function(color)
  {
   var i;
   return new RadarChart.New(this.dataset,this.cfg,this.scfg,(i=this.ccfg,ColorConfig.New(i.PointColor,i.PointHighlightFill,i.PointHighlightStroke,color)));
  },
  WebSharper_Charting_Charts_IColorChart_1$WithPointHighlightStroke:function(color)
  {
   var i;
   return new RadarChart.New(this.dataset,this.cfg,this.scfg,(i=this.ccfg,ColorConfig.New(i.PointColor,i.PointHighlightFill,color,i.PointStrokeColor)));
  },
  WebSharper_Charting_Charts_IColorChart_1$WithPointHighlightFill:function(color)
  {
   var i;
   return new RadarChart.New(this.dataset,this.cfg,this.scfg,(i=this.ccfg,ColorConfig.New(i.PointColor,color,i.PointHighlightStroke,i.PointStrokeColor)));
  },
  WebSharper_Charting_Charts_IColorChart_1$WithPointColor:function(color)
  {
   var i;
   return new RadarChart.New(this.dataset,this.cfg,this.scfg,(i=this.ccfg,ColorConfig.New(color,i.PointHighlightFill,i.PointHighlightStroke,i.PointStrokeColor)));
  },
  WebSharper_Charting_Charts_IColorChart_1$get_ColorConfig:function()
  {
   return this.ccfg;
  },
  WebSharper_Charting_Charts_ISeriesChart_1$WithStrokeColor:function(color)
  {
   var i;
   return new RadarChart.New(this.dataset,this.cfg,(i=this.scfg,SeriesChartConfig.New(i.XAxis,i.YAxis,i.FillColor,color)),this.ccfg);
  },
  WebSharper_Charting_Charts_ISeriesChart_1$WithFillColor:function(color)
  {
   var i;
   return new RadarChart.New(this.dataset,this.cfg,(i=this.scfg,SeriesChartConfig.New(i.XAxis,i.YAxis,color,i.StrokeColor)),this.ccfg);
  },
  WebSharper_Charting_Charts_ISeriesChart_1$WithYAxis:function(yAxis)
  {
   var i;
   return new RadarChart.New(this.dataset,this.cfg,(i=this.scfg,SeriesChartConfig.New(i.XAxis,yAxis,i.FillColor,i.StrokeColor)),this.ccfg);
  },
  WebSharper_Charting_Charts_ISeriesChart_1$WithXAxis:function(xAxis)
  {
   var i;
   return new RadarChart.New(this.dataset,this.cfg,(i=this.scfg,SeriesChartConfig.New(xAxis,i.YAxis,i.FillColor,i.StrokeColor)),this.ccfg);
  },
  WebSharper_Charting_Charts_ISeriesChart_1$get_SeriesConfig:function()
  {
   return this.scfg;
  },
  WebSharper_Charting_Charts_IChart_1$WithTitle:function(title)
  {
   return new RadarChart.New(this.dataset,ChartConfig.New(title),this.scfg,this.ccfg);
  },
  WebSharper_Charting_Charts_IChart_1$get_Config:function()
  {
   return this.cfg;
  },
  WebSharper_Charting_Charts_IMutableChart_2$OnUpdate:function(fn)
  {
   Util.addListener(this.event.event,fn);
  },
  WebSharper_Charting_Charts_IMutableChart_2$UpdateData:function(data,props)
  {
   this.event.event.Trigger([data,props]);
  }
 },null,RadarChart);
 RadarChart.New=Runtime.Ctor(function(dataset,cfg,scfg,ccfg)
 {
  this.dataset=dataset;
  this.cfg=cfg;
  this.scfg=scfg;
  this.ccfg=ccfg;
  this.event=new FSharpEvent.New();
 },RadarChart);
 PolarAreaChart=Charts.PolarAreaChart=Runtime.Class({
  __WithTitle:function(title)
  {
   return this.cst(this).WebSharper_Charting_Charts_IChart_1$WithTitle(title);
  },
  __DataSet:function()
  {
   return this.cst(this).WebSharper_Charting_Charts_IPolarAreaChart_1$get_DataSet();
  },
  get__Config:function()
  {
   return this.cst(this).WebSharper_Charting_Charts_IChart_1$get_Config();
  },
  __UpdateData:function(props,data)
  {
   this.WebSharper_Charting_Charts_IMutableChart_2$UpdateData(props,data);
  },
  cst:Global.id,
  WebSharper_Charting_Charts_IChart_1$WithTitle:function(title)
  {
   return new PolarAreaChart.New(this.dataset,ChartConfig.New(title));
  },
  WebSharper_Charting_Charts_IPolarAreaChart_1$get_DataSet:function()
  {
   return this.dataset;
  },
  WebSharper_Charting_Charts_IChart_1$get_Config:function()
  {
   return this.cfg;
  },
  WebSharper_Charting_Charts_IMutableChart_2$OnUpdate:function(fn)
  {
   Util.addListener(this.event.event,fn);
  },
  WebSharper_Charting_Charts_IMutableChart_2$UpdateData:function(props,data)
  {
   this.event.event.Trigger([props,data]);
  }
 },null,PolarAreaChart);
 PolarAreaChart.New=Runtime.Ctor(function(dataset,cfg)
 {
  this.dataset=dataset;
  this.cfg=cfg;
  this.event=new FSharpEvent.New();
 },PolarAreaChart);
 PieChart=Charts.PieChart=Runtime.Class({
  __WithTitle:function(title)
  {
   return this.cst(this).WebSharper_Charting_Charts_IChart_1$WithTitle(title);
  },
  get__DataSet:function()
  {
   return this.cst(this).WebSharper_Charting_Charts_IPolarAreaChart_1$get_DataSet();
  },
  get__Config:function()
  {
   return this.cst(this).WebSharper_Charting_Charts_IChart_1$get_Config();
  },
  __UpdateData:function(props,data)
  {
   this.WebSharper_Charting_Charts_IMutableChart_2$UpdateData(props,data);
  },
  cst:Global.id,
  WebSharper_Charting_Charts_IChart_1$WithTitle:function(title)
  {
   return new PieChart.New(this.dataset,ChartConfig.New(title));
  },
  WebSharper_Charting_Charts_IPolarAreaChart_1$get_DataSet:function()
  {
   return this.dataset;
  },
  WebSharper_Charting_Charts_IChart_1$get_Config:function()
  {
   return this.cfg;
  },
  WebSharper_Charting_Charts_IMutableChart_2$OnUpdate:function(fn)
  {
   Util.addListener(this.event.event,fn);
  },
  WebSharper_Charting_Charts_IMutableChart_2$UpdateData:function(data,props)
  {
   this.event.event.Trigger([data,props]);
  }
 },null,PieChart);
 PieChart.New=Runtime.Ctor(function(dataset,cfg)
 {
  this.dataset=dataset;
  this.cfg=cfg;
  this.event=new FSharpEvent.New();
 },PieChart);
 DoughnutChart=Charts.DoughnutChart=Runtime.Class({
  __WithTitle:function(title)
  {
   return this.cst(this).WebSharper_Charting_Charts_IChart_1$WithTitle(title);
  },
  get__DataSet:function()
  {
   return this.cst(this).WebSharper_Charting_Charts_IPolarAreaChart_1$get_DataSet();
  },
  get__Config:function()
  {
   return this.cst(this).WebSharper_Charting_Charts_IChart_1$get_Config();
  },
  __UpdateData:function(props,data)
  {
   this.WebSharper_Charting_Charts_IMutableChart_2$UpdateData(props,data);
  },
  cst:Global.id,
  WebSharper_Charting_Charts_IChart_1$WithTitle:function(title)
  {
   return new DoughnutChart.New(this.dataset,ChartConfig.New(title));
  },
  WebSharper_Charting_Charts_IPolarAreaChart_1$get_DataSet:function()
  {
   return this.dataset;
  },
  WebSharper_Charting_Charts_IChart_1$get_Config:function()
  {
   return this.cfg;
  },
  WebSharper_Charting_Charts_IMutableChart_2$OnUpdate:function(fn)
  {
   Util.addListener(this.event.event,fn);
  },
  WebSharper_Charting_Charts_IMutableChart_2$UpdateData:function(data,props)
  {
   this.event.event.Trigger([data,props]);
  }
 },null,DoughnutChart);
 DoughnutChart.New=Runtime.Ctor(function(dataset,cfg)
 {
  this.dataset=dataset;
  this.cfg=cfg;
  this.event=new FSharpEvent.New();
 },DoughnutChart);
 CompositeChart=Charts.CompositeChart=Runtime.Class({
  get_Charts:function()
  {
   return this.charts;
  }
 },null,CompositeChart);
 CompositeChart.New=Runtime.Ctor(function(charts)
 {
  this.charts=charts;
 },CompositeChart);
 Charts.defaultPolarData=function()
 {
  SC$1.$cctor();
  return SC$1.defaultPolarData;
 };
 Charts.defaultColorConfig=function()
 {
  SC$1.$cctor();
  return SC$1.defaultColorConfig;
 };
 Charts.defaultSeriesChartConfig=function()
 {
  SC$1.$cctor();
  return SC$1.defaultSeriesChartConfig;
 };
 Charts.defaultChartConfig=function()
 {
  SC$1.$cctor();
  return SC$1.defaultChartConfig;
 };
 Chart.Combine=function(charts)
 {
  return new CompositeChart.New(charts);
 };
 Chart.Doughnut=function(dataset)
 {
  var d,m;
  d=(m=function(t)
  {
   return((Charts.defaultPolarData())(t[0]))(t[1]);
  },function(s)
  {
   return Seq$1.map(m,s);
  }(dataset));
  return new DoughnutChart.New({
   $:0,
   $0:d
  },Charts.defaultChartConfig());
 };
 Chart.Doughnut$1=function(dataset)
 {
  return new DoughnutChart.New({
   $:0,
   $0:dataset
  },Charts.defaultChartConfig());
 };
 Chart.Pie=function(dataset)
 {
  var d,m;
  d=(m=function(t)
  {
   return((Charts.defaultPolarData())(t[0]))(t[1]);
  },function(s)
  {
   return Seq$1.map(m,s);
  }(dataset));
  return new PieChart.New({
   $:0,
   $0:d
  },Charts.defaultChartConfig());
 };
 Chart.Pie$1=function(dataset)
 {
  return new PieChart.New({
   $:0,
   $0:dataset
  },Charts.defaultChartConfig());
 };
 Chart.PolarArea=function(dataset)
 {
  var d,m;
  d=(m=function(t)
  {
   return((Charts.defaultPolarData())(t[0]))(t[1]);
  },function(s)
  {
   return Seq$1.map(m,s);
  }(dataset));
  return new PolarAreaChart.New({
   $:0,
   $0:d
  },Charts.defaultChartConfig());
 };
 Chart.PolarArea$1=function(dataset)
 {
  return new PolarAreaChart.New({
   $:0,
   $0:dataset
  },Charts.defaultChartConfig());
 };
 Chart.Radar=function(dataset)
 {
  return new RadarChart.New({
   $:0,
   $0:Pervasives.withIndex(dataset)
  },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig(),Charts.defaultColorConfig());
 };
 Chart.Radar$1=function(dataset)
 {
  return new RadarChart.New({
   $:0,
   $0:dataset
  },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig(),Charts.defaultColorConfig());
 };
 Chart.Bar=function(dataset)
 {
  return new BarChart.New({
   $:0,
   $0:Pervasives.withIndex(dataset)
  },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig());
 };
 Chart.Bar$1=function(dataset)
 {
  return new BarChart.New({
   $:0,
   $0:dataset
  },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig());
 };
 Chart.Line=function(dataset)
 {
  return new LineChart.New({
   $:0,
   $0:Pervasives.withIndex(dataset)
  },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig(),Charts.defaultColorConfig());
 };
 Chart.Line$1=function(dataset)
 {
  return new LineChart.New({
   $:0,
   $0:dataset
  },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig(),Charts.defaultColorConfig());
 };
 LiveChart.Doughnut=function(dataset)
 {
  return new DoughnutChart.New({
   $:1,
   $0:Reactive$2.Select(dataset,function(t)
   {
    return((Charts.defaultPolarData())(t[0]))(t[1]);
   })
  },Charts.defaultChartConfig());
 };
 LiveChart.Doughnut$1=function(dataset)
 {
  return new DoughnutChart.New({
   $:1,
   $0:dataset
  },Charts.defaultChartConfig());
 };
 LiveChart.Pie=function(dataset)
 {
  return new PieChart.New({
   $:1,
   $0:Reactive$2.Select(dataset,function(t)
   {
    return((Charts.defaultPolarData())(t[0]))(t[1]);
   })
  },Charts.defaultChartConfig());
 };
 LiveChart.Pie$1=function(dataset)
 {
  return new PieChart.New({
   $:1,
   $0:dataset
  },Charts.defaultChartConfig());
 };
 LiveChart.PolarArea=function(dataset)
 {
  return new PolarAreaChart.New({
   $:1,
   $0:Reactive$2.Select(dataset,function(t)
   {
    return((Charts.defaultPolarData())(t[0]))(t[1]);
   })
  },Charts.defaultChartConfig());
 };
 LiveChart.PolarArea$1=function(dataset)
 {
  return new PolarAreaChart.New({
   $:1,
   $0:dataset
  },Charts.defaultChartConfig());
 };
 LiveChart.Radar=function(dataset)
 {
  return new RadarChart.New({
   $:1,
   $0:Pervasives.streamWithLabel(dataset)
  },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig(),Charts.defaultColorConfig());
 };
 LiveChart.Radar$1=function(dataset)
 {
  return new RadarChart.New({
   $:1,
   $0:dataset
  },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig(),Charts.defaultColorConfig());
 };
 LiveChart.Bar=function(dataset)
 {
  return new BarChart.New({
   $:1,
   $0:Pervasives.streamWithLabel(dataset)
  },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig());
 };
 LiveChart.Bar$1=function(dataset)
 {
  return new BarChart.New({
   $:1,
   $0:dataset
  },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig());
 };
 LiveChart.Line=function(dataset)
 {
  return new LineChart.New({
   $:1,
   $0:Pervasives.streamWithLabel(dataset)
  },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig(),Charts.defaultColorConfig());
 };
 LiveChart.Line$1=function(dataset)
 {
  return new LineChart.New({
   $:1,
   $0:dataset
  },Charts.defaultChartConfig(),Charts.defaultSeriesChartConfig(),Charts.defaultColorConfig());
 };
 SC$1.$cctor=Runtime.Cctor(function()
 {
  var rand;
  SC$1.defaultChartConfig=ChartConfig.New("Chart");
  SC$1.defaultSeriesChartConfig=SeriesChartConfig.New("x","y",new Color({
   $:0,
   $0:220,
   $1:220,
   $2:220,
   $3:0.2
  }),new Color({
   $:0,
   $0:220,
   $1:220,
   $2:220,
   $3:1
  }));
  SC$1.defaultColorConfig=ColorConfig.New(new Color({
   $:0,
   $0:220,
   $1:220,
   $2:220,
   $3:1
  }),new Color({
   $:1,
   $0:"#fff"
  }),new Color({
   $:0,
   $0:220,
   $1:220,
   $2:220,
   $3:1
  }),new Color({
   $:1,
   $0:"#fff"
  }));
  SC$1.defaultPolarData=(rand=new Random.New(),function(label)
  {
   return function(data)
   {
    var p,r,g,b;
    p=(r=rand.Next(0,256),(g=rand.Next(0,256),(b=rand.Next(0,256),[new Color({
     $:0,
     $0:r,
     $1:g,
     $2:b,
     $3:1
    }),new Color({
     $:0,
     $0:r,
     $1:g,
     $2:b,
     $3:0.6
    })])));
    return PolarData.New(data,p[0],p[1],label);
   };
  });
  SC$1.$cctor=Global.ignore;
 });
 BatchUpdater=ChartJsInternal.BatchUpdater=Runtime.Class({
  Update:function(updater)
  {
   var $this,o;
   function doUpdate()
   {
    $this.handle[0]=null;
    $this.count[0]=0;
    updater();
   }
   $this=this;
   o=this.handle[0];
   o==null?void 0:Global.clearTimeout(o.$0);
   this.count[0]<this.maxCount?(Ref.incr(this.count),this.handle[0]={
    $:1,
    $0:Global.setTimeout(doUpdate,this.interval)
   }):doUpdate();
  }
 },null,BatchUpdater);
 BatchUpdater.New=Runtime.Ctor(function(interval,maxCount)
 {
  this.interval=Operators.DefaultArg(interval,75);
  this.maxCount=Operators.DefaultArg(maxCount,10);
  this.handle=[null];
  this.count=[0];
 },BatchUpdater);
 ChartJsInternal.RenderCombinedRadarChart=function(chart,size,cfg,window$1)
 {
  var k;
  k=function(canvas)
  {
   var labels,e,c,data,m,rendered,a,streams,m$1,l,r;
   labels=(e=(c=function(chart$1)
   {
    var m$2;
    m$2=chart$1.get_DataSet();
    return m$2.$==1?null:{
     $:1,
     $0:Seq$1.map(function(t)
     {
      return t[0];
     },m$2.$0)
    };
   },function(s)
   {
    return Seq$1.choose(c,s);
   }(chart.get_Charts())),Seq$1.length(e)>0?Seq$1.maxBy(Seq$1.length,e):[]);
   data={
    datasets:Arrays.ofSeq((m=function(chart$1)
    {
     var initials,r$1,m$2;
     initials=ChartJsInternal.mkInitial(chart$1.get_DataSet(),window$1);
     r$1={};
     r$1.label=chart$1.get__Config().Title;
     r$1.backgroundColor=Global.String(chart$1.get__SeriesConfig().FillColor);
     r$1.borderColor=Global.String(chart$1.get__SeriesConfig().StrokeColor);
     r$1.pointBackgroundColor=Global.String(chart$1.get__ColorConfig().PointColor);
     r$1.pointHoverBackgroundColor=Global.String(chart$1.get__ColorConfig().PointHighlightFill);
     r$1.pointHoverBorderColor=Global.String(chart$1.get__ColorConfig().PointHighlightStroke);
     r$1.pointBorderColor=Global.String(chart$1.get__ColorConfig().PointStrokeColor);
     r$1.data=(m$2=function(t)
     {
      return t[1];
     },function(a$1)
     {
      return Arrays.map(m$2,a$1);
     }(initials));
     return r$1;
    },function(s)
    {
     return Seq$1.map(m,s);
    }(chart.get_Charts())))
   };
   data.labels=Arrays.ofSeq(labels);
   rendered=new Global.Chart(canvas,{
    type:"radar",
    data:data,
    options:Operators.DefaultArg(cfg,{})
   });
   a=function(i,chart$1)
   {
    var u;
    u=function(j,$1)
    {
     var data$1,ds,s;
     data$1=rendered.data;
     ds=data$1.datasets;
     s=Arrays.get(ds,i).data;
     s[j]=$1(Arrays.get(s,j));
    };
    return function(f)
    {
     return ChartJsInternal.registerUpdater(chart$1,function($1,$2)
     {
      return u($1,$2);
     },f);
    }(function()
    {
     rendered.update();
    });
   };
   (function(s)
   {
    Seq$1.iteri(a,s);
   }(chart.get_Charts()));
   streams=ChartJsInternal.extractStreams((m$1=function(chart$1)
   {
    return chart$1.get_DataSet();
   },function(s)
   {
    return Seq$1.map(m$1,s);
   }(chart.get_Charts())));
   l=Seq$1.length(chart.get_Charts());
   return(r=function()
   {
    var data$1,ds,labels$1,a$1;
    data$1=rendered.data;
    ds=data$1.datasets;
    labels$1=data$1.labels;
    a$1=function(d)
    {
     d.data.shift();
    };
    (function(a$2)
    {
     Arrays.iter(a$1,a$2);
    }(ds));
    labels$1.shift();
    return rendered.update();
   },function(a$1)
   {
    return ChartJsInternal.onCombinedEvent(streams,l,window$1,function($1,$2)
    {
     return r($1,$2);
    },function($1,$2)
    {
     return(a$1($1))($2);
    });
   })(function()
   {
    return function(t)
    {
     var arr,data$1,ds,labels$1,a$1;
     arr=t[0];
     data$1=rendered.data;
     ds=data$1.datasets;
     labels$1=data$1.labels;
     a$1=function(i,d)
     {
      var dd;
      dd=d.data;
      return dd[Arrays.length(dd)]=Arrays.get(arr,i);
     };
     (function(a$2)
     {
      Arrays.iteri(a$1,a$2);
     }(ds));
     labels$1[Arrays.length(labels$1)]=t[1];
     return rendered.update();
    };
   });
  };
  return ChartJsInternal.withNewCanvas(size,function($1,$2)
  {
   return k($1,$2);
  });
 };
 ChartJsInternal.RenderCombinedBarChart=function(chart,size,cfg,window$1)
 {
  var k;
  k=function(canvas)
  {
   var labels,e,c,data,m,rendered,a,streams,m$1,l,r;
   labels=(e=(c=function(chart$1)
   {
    var m$2;
    m$2=chart$1.get_DataSet();
    return m$2.$==1?null:{
     $:1,
     $0:Seq$1.map(function(t)
     {
      return t[0];
     },m$2.$0)
    };
   },function(s)
   {
    return Seq$1.choose(c,s);
   }(chart.get_Charts())),Seq$1.length(e)>0?Seq$1.maxBy(Seq$1.length,e):[]);
   data={
    datasets:Arrays.ofSeq((m=function(chart$1)
    {
     var initials,r$1,m$2;
     initials=ChartJsInternal.mkInitial(chart$1.get_DataSet(),window$1);
     r$1={};
     r$1.label=chart$1.get__Config().Title;
     r$1.backgroundColor=Global.String(chart$1.get__SeriesConfig().FillColor);
     r$1.borderColor=Global.String(chart$1.get__SeriesConfig().StrokeColor);
     r$1.data=(m$2=function(t)
     {
      return t[1];
     },function(a$1)
     {
      return Arrays.map(m$2,a$1);
     }(initials));
     return r$1;
    },function(s)
    {
     return Seq$1.map(m,s);
    }(chart.get_Charts())))
   };
   data.labels=Arrays.ofSeq(labels);
   rendered=new Global.Chart(canvas,{
    type:"bar",
    data:data,
    options:Operators.DefaultArg(cfg,{})
   });
   a=function(i,chart$1)
   {
    var u;
    u=function(j,$1)
    {
     var data$1,ds,s;
     data$1=rendered.data;
     ds=data$1.datasets;
     s=Arrays.get(ds,i).data;
     s[j]=$1(Arrays.get(s,j));
    };
    return function(f)
    {
     return ChartJsInternal.registerUpdater(chart$1,function($1,$2)
     {
      return u($1,$2);
     },f);
    }(function()
    {
     rendered.update();
    });
   };
   (function(s)
   {
    Seq$1.iteri(a,s);
   }(chart.get_Charts()));
   streams=ChartJsInternal.extractStreams((m$1=function(chart$1)
   {
    return chart$1.get_DataSet();
   },function(s)
   {
    return Seq$1.map(m$1,s);
   }(chart.get_Charts())));
   l=Seq$1.length(chart.get_Charts());
   return(r=function()
   {
    var data$1,ds,labels$1,a$1;
    data$1=rendered.data;
    ds=data$1.datasets;
    labels$1=data$1.labels;
    a$1=function(d)
    {
     d.data.shift();
    };
    (function(a$2)
    {
     Arrays.iter(a$1,a$2);
    }(ds));
    labels$1.shift();
    return rendered.update();
   },function(a$1)
   {
    return ChartJsInternal.onCombinedEvent(streams,l,window$1,function($1,$2)
    {
     return r($1,$2);
    },function($1,$2)
    {
     return(a$1($1))($2);
    });
   })(function()
   {
    return function(t)
    {
     var arr,data$1,ds,labels$1,a$1;
     arr=t[0];
     data$1=rendered.data;
     ds=data$1.datasets;
     labels$1=data$1.labels;
     a$1=function(i,d)
     {
      var dd;
      dd=d.data;
      return dd[Arrays.length(dd)]=Arrays.get(arr,i);
     };
     (function(a$2)
     {
      Arrays.iteri(a$1,a$2);
     }(ds));
     labels$1[Arrays.length(labels$1)]=t[1];
     return rendered.update();
    };
   });
  };
  return ChartJsInternal.withNewCanvas(size,function($1,$2)
  {
   return k($1,$2);
  });
 };
 ChartJsInternal.RenderCombinedLineChart=function(chart,size,cfg,window$1)
 {
  var k;
  k=function(canvas)
  {
   var labels,e,m,m$1,c,data,m$2,rendered,a,streams,m$3,l,r;
   labels=(e=(m=(m$1=function(t)
   {
    return t[0];
   },function(s)
   {
    return Seq$1.map(m$1,s);
   }),function(s)
   {
    return Seq$1.map(m,s);
   }((c=function(chart$1)
   {
    var m$4;
    m$4=chart$1.get_DataSet();
    return m$4.$==1?null:{
     $:1,
     $0:ChartJsInternal.mkInitial(m$4,window$1)
    };
   },function(s)
   {
    return Seq$1.choose(c,s);
   }(chart.get_Charts())))),Seq$1.length(e)>0?Seq$1.maxBy(Seq$1.length,e):[]);
   data={
    datasets:Arrays.ofSeq((m$2=function(chart$1)
    {
     var initials,r$1,m$4;
     initials=ChartJsInternal.mkInitial(chart$1.get_DataSet(),window$1);
     r$1={};
     r$1.label=chart$1.get__Config().Title;
     r$1.backgroundColor=Global.String(chart$1.get__SeriesConfig().FillColor);
     r$1.borderColor=Global.String(chart$1.get__SeriesConfig().StrokeColor);
     r$1.pointBackgroundColor=Global.String(chart$1.get__ColorConfig().PointColor);
     r$1.pointHoverBackgroundColor=Global.String(chart$1.get__ColorConfig().PointHighlightFill);
     r$1.pointHoverBorderColor=Global.String(chart$1.get__ColorConfig().PointHighlightStroke);
     r$1.pointBorderColor=Global.String(chart$1.get__ColorConfig().PointStrokeColor);
     r$1.data=(m$4=function(t)
     {
      return t[1];
     },function(a$1)
     {
      return Arrays.map(m$4,a$1);
     }(initials));
     return r$1;
    },function(s)
    {
     return Seq$1.map(m$2,s);
    }(chart.get_Charts())))
   };
   data.labels=Arrays.ofSeq(labels);
   rendered=Global.Chart.Line(canvas,{
    type:"line",
    data:data,
    options:Operators.DefaultArg(cfg,{})
   });
   a=function(i,chart$1)
   {
    var u;
    u=function(j,$1)
    {
     var data$1,ds,s;
     data$1=rendered.data;
     ds=data$1.datasets;
     s=Arrays.get(ds,i).data;
     s[j]=$1(Arrays.get(s,j));
    };
    return function(f)
    {
     return ChartJsInternal.registerUpdater(chart$1,function($1,$2)
     {
      return u($1,$2);
     },f);
    }(function()
    {
     rendered.update();
    });
   };
   (function(s)
   {
    Seq$1.iteri(a,s);
   }(chart.get_Charts()));
   streams=ChartJsInternal.extractStreams((m$3=function(chart$1)
   {
    return chart$1.get_DataSet();
   },function(s)
   {
    return Seq$1.map(m$3,s);
   }(chart.get_Charts())));
   l=Seq$1.length(chart.get_Charts());
   return(r=function()
   {
    var data$1,ds,labels$1,a$1;
    data$1=rendered.data;
    ds=data$1.datasets;
    labels$1=data$1.labels;
    a$1=function(d)
    {
     d.data.shift();
    };
    (function(a$2)
    {
     Arrays.iter(a$1,a$2);
    }(ds));
    labels$1.shift();
    return rendered.update();
   },function(a$1)
   {
    return ChartJsInternal.onCombinedEvent(streams,l,window$1,function($1,$2)
    {
     return r($1,$2);
    },function($1,$2)
    {
     return(a$1($1))($2);
    });
   })(function()
   {
    return function(t)
    {
     var arr,data$1,ds,labels$1,a$1;
     arr=t[0];
     data$1=rendered.data;
     ds=data$1.datasets;
     labels$1=data$1.labels;
     a$1=function(i,d)
     {
      var dd;
      dd=d.data;
      return dd[Arrays.length(dd)]=Arrays.get(arr,i);
     };
     (function(a$2)
     {
      Arrays.iteri(a$1,a$2);
     }(ds));
     labels$1[Arrays.length(labels$1)]=t[1];
     return rendered.update();
    };
   });
  };
  return ChartJsInternal.withNewCanvas(size,function($1,$2)
  {
   return k($1,$2);
  });
 };
 ChartJsInternal.onCombinedEvent=function(streams,l,window$1,remove,add)
 {
  var size;
  size=[0];
  Util.addListener(streams,function(data)
  {
   var a,arr,a$1,a$2;
   a=function(window$2)
   {
    if(size[0]>=window$2)
     remove(window$2,size[0]);
   };
   (function(o)
   {
    if(o==null)
     ;
    else
     a(o.$0);
   }(window$1));
   arr=Arrays.ofSeq(Seq$1.delay(function()
   {
    return Seq$1.map(function()
    {
     return 0;
    },Operators.range(1,l));
   }));
   a$1=function(i,a$3)
   {
    Arrays.set(arr,i,a$3[1]);
   };
   (function(s)
   {
    Seq$1.iter(function($1)
    {
     return a$1($1[0],$1[1]);
    },s);
   }(data));
   a$2=function(a$3,a$4)
   {
    add(size[0],[arr,a$4[0]]);
   };
   (function(o)
   {
    if(o==null)
     ;
    else
     a$2.apply(null,o.$0);
   }(Seq.headOption(data)));
   Ref.incr(size);
  });
 };
 ChartJsInternal.extractStreams=function(dataSet)
 {
  var c,m;
  return Reactive.SequenceOnlyNew((c=Global.id,function(s)
  {
   return Seq$1.choose(c,s);
  }((m=function(i,data)
  {
   return data.$==0?null:{
    $:1,
    $0:Reactive$2.Select(data.$0,function(d)
    {
     return[i,d];
    })
   };
  },function(s)
  {
   return Seq$1.mapi(m,s);
  }(dataSet)))));
 };
 ChartJsInternal.RenderPolarAreaChart=function(chart,size,typ,window$1)
 {
  var k;
  k=function(canvas)
  {
   var initial,toBGColor,m,toHBGColor,m$1,toValue,m$2,toLabel,m$3,cc,x,r,x$1,r$1,x$2,r$2,rendered,d,r$3,a;
   initial=ChartJsInternal.mkInitial(chart.WebSharper_Charting_Charts_IPolarAreaChart_1$get_DataSet(),null);
   toBGColor=(m=function(e)
   {
    return Global.String(e.Color);
   },function(a$1)
   {
    return Arrays.map(m,a$1);
   }(initial));
   toHBGColor=(m$1=function(e)
   {
    return Global.String(e.Highlight);
   },function(a$1)
   {
    return Arrays.map(m$1,a$1);
   }(initial));
   toValue=(m$2=function(e)
   {
    return Global.Number(e.Value);
   },function(a$1)
   {
    return Arrays.map(m$2,a$1);
   }(initial));
   toLabel=(m$3=function(e)
   {
    return e.Label;
   },function(a$1)
   {
    return Arrays.map(m$3,a$1);
   }(initial));
   cc=typ.$==1?(x={
    datasets:[(r={},r.data=toValue,r.backgroundColor=toBGColor,r.hoverBackgroundColor=toHBGColor,r)]
   },(x.labels=toLabel,{
    type:"pie",
    data:x,
    options:typ.$0
   })):typ.$==2?(x$1={
    datasets:[(r$1={},r$1.data=toValue,r$1.backgroundColor=toBGColor,r$1.hoverBackgroundColor=toHBGColor,r$1)]
   },(x$1.labels=toLabel,{
    type:"doughnut",
    data:x$1,
    options:typ.$0
   })):(x$2={
    datasets:[(r$2={},r$2.data=toValue,r$2.backgroundColor=toBGColor,r$2.hoverBackgroundColor=toHBGColor,r$2)]
   },(x$2.labels=toLabel,{
    type:"polar",
    data:x$2,
    options:typ.$0
   }));
   rendered=new Global.Chart(canvas,cc);
   d=chart.WebSharper_Charting_Charts_IPolarAreaChart_1$get_DataSet();
   (r$3=function()
   {
    var data,ds,labels,a$1;
    data=rendered.data;
    ds=data.datasets;
    labels=data.labels;
    a$1=function(d$1)
    {
     d$1.data.shift();
    };
    (function(a$2)
    {
     Arrays.iter(a$1,a$2);
    }(ds));
    labels.shift();
    return rendered.update();
   },function(a$1)
   {
    return ChartJsInternal.onEvent(d,window$1,function($1,$2)
    {
     return r$3($1,$2);
    },function($1,$2)
    {
     return(a$1($1))($2);
    });
   })(function(a$1)
   {
    return function(polardata)
    {
     var data,ds,labels,a$2;
     data=rendered.data;
     ds=data.datasets;
     labels=data.labels;
     a$2=function(i,d$1)
     {
      var dd;
      dd=d$1.data;
      return dd[Arrays.length(dd)]=polardata.Value;
     };
     (function(a$3)
     {
      Arrays.iteri(a$2,a$3);
     }(ds));
     labels[Arrays.length(labels)]=a$1;
     return rendered.update();
    };
   });
   a=function(i,$1)
   {
    var data,ds,s;
    data=rendered.data;
    ds=data.datasets;
    s=Arrays.get(ds,0).data;
    s[i]=$1(Arrays.get(s,i));
    rendered.update();
   };
   return chart.WebSharper_Charting_Charts_IMutableChart_2$OnUpdate(function($1)
   {
    return a($1[0],$1[1]);
   });
  };
  return ChartJsInternal.withNewCanvas(size,function($1,$2)
  {
   return k($1,$2);
  });
 };
 ChartJsInternal.RenderRadarChart=function(chart,size,cfg,window$1)
 {
  var k;
  k=function(canvas)
  {
   var initial,data,r,m,m$1,rendered,u,d,r$1;
   initial=ChartJsInternal.mkInitial(chart.get_DataSet(),window$1);
   data={
    datasets:[(r={},r.label=chart.get__Config().Title,r.backgroundColor=Global.String(chart.get__SeriesConfig().FillColor),r.borderColor=Global.String(chart.get__SeriesConfig().StrokeColor),r.pointBackgroundColor=Global.String(chart.get__ColorConfig().PointColor),r.pointHoverBackgroundColor=Global.String(chart.get__ColorConfig().PointHighlightFill),r.pointHoverBorderColor=Global.String(chart.get__ColorConfig().PointHighlightStroke),r.pointBorderColor=Global.String(chart.get__ColorConfig().PointStrokeColor),r.data=(m=function(t)
    {
     return t[1];
    },function(a)
    {
     return Arrays.map(m,a);
    }(initial)),r)]
   };
   data.labels=(m$1=function(t)
   {
    return t[0];
   },function(a)
   {
    return Arrays.map(m$1,a);
   }(initial));
   rendered=new Global.Chart(canvas,{
    type:"radar",
    data:data,
    options:Operators.DefaultArg(cfg,{})
   });
   u=function(i,$1)
   {
    var data$1,ds,s;
    data$1=rendered.data;
    ds=data$1.datasets;
    s=Arrays.get(ds,0).data;
    s[i]=$1(Arrays.get(s,i));
   };
   (function(f)
   {
    return ChartJsInternal.registerUpdater(chart,function($1,$2)
    {
     return u($1,$2);
    },f);
   }(function()
   {
    rendered.update();
   }));
   d=chart.get_DataSet();
   return(r$1=function()
   {
    var data$1,ds,labels,a;
    data$1=rendered.data;
    ds=data$1.datasets;
    labels=data$1.labels;
    a=function(d$1)
    {
     d$1.data.shift();
    };
    (function(a$1)
    {
     Arrays.iter(a,a$1);
    }(ds));
    labels.shift();
    return rendered.update();
   },function(a)
   {
    return ChartJsInternal.onEvent(d,window$1,function($1,$2)
    {
     return r$1($1,$2);
    },function($1,$2)
    {
     return(a($1))($2);
    });
   })(function()
   {
    return function(t)
    {
     var arr,data$1,ds,labels,a;
     arr=t[0];
     data$1=rendered.data;
     ds=data$1.datasets;
     labels=data$1.labels;
     a=function(i,d$1)
     {
      var dd;
      dd=d$1.data;
      return dd[Arrays.length(dd)]=arr.charCodeAt(i);
     };
     (function(a$1)
     {
      Arrays.iteri(a,a$1);
     }(ds));
     labels[Arrays.length(labels)]=t[1];
     return rendered.update();
    };
   });
  };
  return ChartJsInternal.withNewCanvas(size,function($1,$2)
  {
   return k($1,$2);
  });
 };
 ChartJsInternal.RenderBarChart=function(chart,size,cfg,window$1)
 {
  var k;
  k=function(canvas)
  {
   var initial,data,r,m,m$1,rendered,u,d,r$1;
   initial=ChartJsInternal.mkInitial(chart.get_DataSet(),window$1);
   data={
    datasets:[(r={},r.label=chart.get__Config().Title,r.backgroundColor=Global.String(chart.get__SeriesConfig().FillColor),r.borderColor=Global.String(chart.get__SeriesConfig().StrokeColor),r.data=(m=function(t)
    {
     return t[1];
    },function(a)
    {
     return Arrays.map(m,a);
    }(initial)),r)]
   };
   data.labels=(m$1=function(t)
   {
    return t[0];
   },function(a)
   {
    return Arrays.map(m$1,a);
   }(initial));
   rendered=new Global.Chart(canvas,{
    type:"bar",
    data:data,
    options:Operators.DefaultArg(cfg,{})
   });
   u=function(i,$1)
   {
    var data$1,ds,s;
    data$1=rendered.data;
    ds=data$1.datasets;
    s=Arrays.get(ds,0).data;
    s[i]=$1(Arrays.get(s,i));
   };
   (function(f)
   {
    return ChartJsInternal.registerUpdater(chart,function($1,$2)
    {
     return u($1,$2);
    },f);
   }(function()
   {
    rendered.update();
   }));
   d=chart.get_DataSet();
   return(r$1=function()
   {
    var data$1,ds,labels,a;
    data$1=rendered.data;
    ds=data$1.datasets;
    labels=data$1.labels;
    a=function(d$1)
    {
     d$1.data.shift();
    };
    (function(a$1)
    {
     Arrays.iter(a,a$1);
    }(ds));
    labels.shift();
    return rendered.update();
   },function(a)
   {
    return ChartJsInternal.onEvent(d,window$1,function($1,$2)
    {
     return r$1($1,$2);
    },function($1,$2)
    {
     return(a($1))($2);
    });
   })(function()
   {
    return function(t)
    {
     var arr,data$1,ds,labels,a;
     arr=t[0];
     data$1=rendered.data;
     ds=data$1.datasets;
     labels=data$1.labels;
     a=function(i,d$1)
     {
      var dd;
      dd=d$1.data;
      return dd[Arrays.length(dd)]=arr.charCodeAt(i);
     };
     (function(a$1)
     {
      Arrays.iteri(a,a$1);
     }(ds));
     labels[Arrays.length(labels)]=t[1];
     return rendered.update();
    };
   });
  };
  return ChartJsInternal.withNewCanvas(size,function($1,$2)
  {
   return k($1,$2);
  });
 };
 ChartJsInternal.RenderLineChart=function(chart,size,cfg,window$1)
 {
  var k;
  k=function(canvas)
  {
   var initial,data,r,m,m$1,rendered,u,d,r$1;
   initial=ChartJsInternal.mkInitial(chart.get_DataSet(),window$1);
   data={
    datasets:[(r={},r.label=chart.get__Config().Title,r.fill=false,r.borderColor=Global.String(chart.get__SeriesConfig().StrokeColor),r.pointBackgroundColor=Global.String(chart.get__ColorConfig().PointColor),r.pointHoverBackgroundColor=Global.String(chart.get__ColorConfig().PointHighlightFill),r.pointHoverBorderColor=Global.String(chart.get__ColorConfig().PointHighlightStroke),r.pointBorderColor=Global.String(chart.get__ColorConfig().PointStrokeColor),r.data=(m=function(t)
    {
     return t[1];
    },function(a)
    {
     return Arrays.map(m,a);
    }(initial)),r)]
   };
   data.labels=(m$1=function(t)
   {
    return t[0];
   },function(a)
   {
    return Arrays.map(m$1,a);
   }(initial));
   rendered=Global.Chart.Line(canvas,{
    type:"line",
    data:data,
    options:Operators.DefaultArg(cfg,{})
   });
   u=function(i,$1)
   {
    var data$1,ds,s;
    data$1=rendered.data;
    ds=data$1.datasets;
    s=Arrays.get(ds,0).data;
    s[i]=$1(Arrays.get(s,i));
   };
   (function(f)
   {
    return ChartJsInternal.registerUpdater(chart,function($1,$2)
    {
     return u($1,$2);
    },f);
   }(function()
   {
    rendered.update();
   }));
   d=chart.get_DataSet();
   return(r$1=function()
   {
    var data$1,ds,labels,a;
    data$1=rendered.data;
    ds=data$1.datasets;
    labels=data$1.labels;
    a=function(d$1)
    {
     d$1.data.shift();
    };
    (function(a$1)
    {
     Arrays.iter(a,a$1);
    }(ds));
    labels.shift();
    return rendered.update();
   },function(a)
   {
    return ChartJsInternal.onEvent(d,window$1,function($1,$2)
    {
     return r$1($1,$2);
    },function($1,$2)
    {
     return(a($1))($2);
    });
   })(function()
   {
    return function(t)
    {
     var arr,data$1,ds,labels,a;
     arr=t[0];
     data$1=rendered.data;
     ds=data$1.datasets;
     labels=data$1.labels;
     a=function(i,d$1)
     {
      var dd;
      dd=d$1.data;
      return dd[Arrays.length(dd)]=arr.charCodeAt(i);
     };
     (function(a$1)
     {
      Arrays.iteri(a,a$1);
     }(ds));
     labels[Arrays.length(labels)]=t[1];
     return rendered.update();
    };
   });
  };
  return ChartJsInternal.withNewCanvas(size,function($1,$2)
  {
   return k($1,$2);
  });
 };
 ChartJsInternal.onEvent=function(dataSet,window$1,remove,add)
 {
  var size;
  if(dataSet.$==1)
   {
    size=[0];
    Util.addListener(dataSet.$0,function(data)
    {
     var a;
     a=function(window$2)
     {
      if(size[0]>=window$2)
       remove(window$2,size[0]);
     };
     (function(o)
     {
      if(o==null)
       ;
      else
       a(o.$0);
     }(window$1));
     add(size[0],data);
     Ref.incr(size);
    });
   }
 };
 ChartJsInternal.mkInitial=function(dataSet,window$1)
 {
  var f,s;
  return dataSet.$==0?(f=function(s$1,w)
  {
   var skp;
   skp=Arrays.length(s$1)-w;
   return skp>=Arrays.length(s$1)?[]:skp<=0?s$1:Slice.array(s$1,{
    $:1,
    $0:skp
   },null);
  },(s=Arrays.ofSeq(dataSet.$0),function(o)
  {
   return Option.fold(f,s,o);
  })(window$1)):[];
 };
 ChartJsInternal.withNewCanvas=function(size,k)
 {
  var width,height,a,a$1,a$2;
  width=size.$0;
  height=size.$1;
  a=[AttrProxy.Create("width",Global.String(width)),AttrProxy.Create("height",Global.String(height)),AttrModule.Style("width",Global.String(width)+"px"),AttrModule.Style("height",Global.String(height)+"px")];
  a$1=[(a$2=[AttrModule.OnAfterRender(function(el)
  {
   var ctx;
   ctx=el.getContext("2d");
   el.width=width;
   el.height=height;
   k(el,ctx);
  })],Doc.Element("canvas",a$2,[]))];
  return Doc.Element("div",a,a$1);
 };
 ChartJsInternal.registerUpdater=function(mChart,upd,fin)
 {
  var bu,a;
  bu=new BatchUpdater.New(null,null);
  a=function($1,$2)
  {
   upd($1,$2);
   bu.Update(fin);
  };
  mChart.WebSharper_Charting_Charts_IMutableChart_2$OnUpdate(function($1)
  {
   return a($1[0],$1[1]);
  });
 };
 ChartJs.Render=function(chart,Size,Config,Window)
 {
  return ChartJsInternal.RenderCombinedRadarChart(chart,Operators.DefaultArg(Size,Renderers.defaultSize()),Config,Window);
 };
 ChartJs.Render$1=function(chart,Size,Config,Window)
 {
  return ChartJsInternal.RenderCombinedBarChart(chart,Operators.DefaultArg(Size,Renderers.defaultSize()),Config,Window);
 };
 ChartJs.Render$2=function(chart,Size,Config,Window)
 {
  return ChartJsInternal.RenderCombinedLineChart(chart,Operators.DefaultArg(Size,Renderers.defaultSize()),Config,Window);
 };
 ChartJs.Render$3=function(chart,Size,Config,Window)
 {
  return ChartJsInternal.RenderRadarChart(chart,Operators.DefaultArg(Size,Renderers.defaultSize()),Config,Window);
 };
 ChartJs.Render$4=function(chart,Size,Config,Window)
 {
  return ChartJsInternal.RenderBarChart(chart,Operators.DefaultArg(Size,Renderers.defaultSize()),Config,Window);
 };
 ChartJs.Render$5=function(chart,Size,Config,Window)
 {
  return ChartJsInternal.RenderLineChart(chart,Operators.DefaultArg(Size,Renderers.defaultSize()),Config,Window);
 };
 Renderers.defaultSize=function()
 {
  SC$2.$cctor();
  return SC$2.defaultSize;
 };
 SC$2.$cctor=Runtime.Cctor(function()
 {
  SC$2.defaultSize={
   $:0,
   $0:500,
   $1:200
  };
  SC$2.$cctor=Global.ignore;
 });
}());
