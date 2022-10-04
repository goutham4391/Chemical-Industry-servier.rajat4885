jQuery(function($){WPGMZA.Feature=function(options)
{var self=this;WPGMZA.assertInstanceOf(this,"Feature");WPGMZA.EventDispatcher.call(this);this.id=-1;for(var key in options)
this[key]=options[key];}
WPGMZA.extend(WPGMZA.Feature,WPGMZA.EventDispatcher);WPGMZA.MapObject=WPGMZA.Feature;WPGMZA.Feature.prototype.parseGeometry=function(subject)
{if(typeof subject=="string"&&subject.match(/^\[/))
{try{var json=JSON.parse(subject);subject=json;}catch(e){}}
if(typeof subject=="object")
{var arr=subject;for(var i=0;i<arr.length;i++)
{arr[i].lat=parseFloat(arr[i].lat);arr[i].lng=parseFloat(arr[i].lng);}
return arr;}
else if(typeof subject=="string")
{var stripped,pairs,coords,results=[];stripped=subject.replace(/[^ ,\d\.\-+e]/g,"");pairs=stripped.split(",");for(var i=0;i<pairs.length;i++)
{coords=pairs[i].split(" ");results.push({lat:parseFloat(coords[1]),lng:parseFloat(coords[0])});}
return results;}
throw new Error("Invalid geometry");}
WPGMZA.Feature.prototype.setOptions=function(options)
{for(var key in options)
this[key]=options[key];this.updateNativeFeature();}
WPGMZA.Feature.prototype.setEditable=function(editable)
{this.setOptions({editable:editable});}
WPGMZA.Feature.prototype.setDraggable=function(draggable)
{this.setOptions({draggable:draggable});}
WPGMZA.Feature.prototype.getScalarProperties=function()
{var options={};for(var key in this)
{switch(typeof this[key])
{case"number":options[key]=parseFloat(this[key]);break;case"boolean":case"string":options[key]=this[key];break;default:break;}}
return options;}
WPGMZA.Feature.prototype.updateNativeFeature=function()
{var props=this.getScalarProperties();switch(WPGMZA.settings.engine)
{case"open-layers":if(this.layer){this.layer.setStyle(WPGMZA.OLFeature.getOLStyle(props));}
break;default:this.googleFeature.setOptions(props);break;}}});