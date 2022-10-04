jQuery(function($){WPGMZA.OLProMap=function(element,options)
{var self=this;WPGMZA.OLMap.call(this,element,options);var prevHoveringFeatures=[];this.loadKMLLayers();this.trigger("init");this.dispatchEvent("created");WPGMZA.events.dispatchEvent({type:"mapcreated",map:this});$(this.element).trigger("wpgooglemaps_loaded");}
WPGMZA.OLProMap.prototype=Object.create(WPGMZA.OLMap.prototype);WPGMZA.OLProMap.prototype.constructor=WPGMZA.OLMap.prototype;WPGMZA.OLMap.prototype.addHeatmap=function(heatmap)
{heatmap.olHeatmap.setMap(this.olMap);WPGMZA.ProMap.prototype.addHeatmap.call(this,heatmap);}
WPGMZA.OLProMap.prototype.loadKMLLayers=function()
{if(this.kmlLayers)
{for(var i=0;i<this.kmlLayers.length;i++)
this.olMap.removeLayer(this.kmlLayers[i]);}
this.kmlLayers=[];if(!this.settings.kml)
return;var urls=this.settings.kml.split(",");var cachebuster=new Date().getTime();for(var i=0;i<urls.length;i++)
{var layer=new ol.layer.Vector({source:new ol.source.Vector({url:urls[i],format:new ol.format.KML({extractAttributes:true})})});this.kmlLayers.push(layer);this.olMap.addLayer(layer);}}});