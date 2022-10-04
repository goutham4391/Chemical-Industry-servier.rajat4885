jQuery(function($){var Parent;WPGMZA.GooglePolygon=function(options,googlePolygon)
{var self=this;if(!options)
options={};Parent.call(this,options,googlePolygon);if(googlePolygon)
{this.googlePolygon=googlePolygon;}
else
{this.googlePolygon=new google.maps.Polygon();}
this.googleFeature=this.googlePolygon;if(options&&options.polydata)
this.googlePolygon.setOptions({paths:this.parseGeometry(options.polydata)});this.googlePolygon.wpgmzaPolygon=this;if(options)
this.setOptions(options);google.maps.event.addListener(this.googlePolygon,"click",function(){self.dispatchEvent({type:"click"});});}
if(WPGMZA.isProVersion())
Parent=WPGMZA.ProPolygon;else
Parent=WPGMZA.Polygon;WPGMZA.GooglePolygon.prototype=Object.create(Parent.prototype);WPGMZA.GooglePolygon.prototype.constructor=WPGMZA.GooglePolygon;WPGMZA.GooglePolygon.prototype.updateNativeFeature=function()
{this.googlePolygon.setOptions(this.getScalarProperties());}
WPGMZA.GooglePolygon.prototype.getEditable=function()
{return this.googlePolygon.getOptions().editable;}
WPGMZA.GooglePolygon.prototype.setEditable=function(value)
{var self=this;this.googlePolygon.setOptions({editable:value});if(value)
{this.googlePolygon.getPaths().forEach(function(path,index){var events=["insert_at","remove_at","set_at"];events.forEach(function(name){google.maps.event.addListener(path,name,function(){self.trigger("change");})});});google.maps.event.addListener(this.googlePolygon,"dragend",function(event){self.trigger("change");});google.maps.event.addListener(this.googlePolygon,"click",function(event){if(!WPGMZA.altKeyDown)
return;var path=this.getPath();path.removeAt(event.vertex);self.trigger("change");});}}
WPGMZA.GooglePolygon.prototype.setDraggable=function(value)
{this.googlePolygon.setDraggable(value);}
WPGMZA.GooglePolygon.prototype.getGeometry=function()
{var result=[];var path=this.googlePolygon.getPath();for(var i=0;i<path.getLength();i++)
{var latLng=path.getAt(i);result.push({lat:latLng.lat(),lng:latLng.lng()});}
return result;}});