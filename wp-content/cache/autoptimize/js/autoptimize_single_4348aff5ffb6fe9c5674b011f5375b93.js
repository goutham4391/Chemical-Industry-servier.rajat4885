jQuery(function($){var Parent;WPGMZA.GoogleMap=function(element,options)
{var self=this;Parent.call(this,element,options);this.loadGoogleMap();if(options){this.setOptions(options,true);}else{this.setOptions({},true);}
google.maps.event.addListener(this.googleMap,"click",function(event){var wpgmzaEvent=new WPGMZA.Event("click");wpgmzaEvent.latLng={lat:event.latLng.lat(),lng:event.latLng.lng()};self.dispatchEvent(wpgmzaEvent);});google.maps.event.addListener(this.googleMap,"rightclick",function(event){var wpgmzaEvent=new WPGMZA.Event("rightclick");wpgmzaEvent.latLng={lat:event.latLng.lat(),lng:event.latLng.lng()};self.dispatchEvent(wpgmzaEvent);});google.maps.event.addListener(this.googleMap,"dragend",function(event){self.dispatchEvent("dragend");});google.maps.event.addListener(this.googleMap,"zoom_changed",function(event){self.dispatchEvent("zoom_changed");self.dispatchEvent("zoomchanged");});google.maps.event.addListener(this.googleMap,"idle",function(event){self.onIdle(event);});if(!WPGMZA.isProVersion())
{this.trigger("init");this.dispatchEvent("created");WPGMZA.events.dispatchEvent({type:"mapcreated",map:this});$(this.element).trigger("wpgooglemaps_loaded");}}
if(WPGMZA.isProVersion())
{Parent=WPGMZA.ProMap;WPGMZA.GoogleMap.prototype=Object.create(WPGMZA.ProMap.prototype);}
else
{Parent=WPGMZA.Map;WPGMZA.GoogleMap.prototype=Object.create(WPGMZA.Map.prototype);}
WPGMZA.GoogleMap.prototype.constructor=WPGMZA.GoogleMap;WPGMZA.GoogleMap.parseThemeData=function(raw)
{var json;try{json=JSON.parse(raw);}catch(e){try{json=eval(raw);}catch(e){var str=raw;str=str.replace(/\\'/g,'\'');str=str.replace(/\\"/g,'"');str=str.replace(/\\0/g,'\0');str=str.replace(/\\\\/g,'\\');try{json=eval(str);}catch(e){console.warn("Couldn't parse theme data");return[];}}}
return json;}
WPGMZA.GoogleMap.prototype.loadGoogleMap=function()
{var self=this;var options=this.settings.toGoogleMapsOptions();this.googleMap=new google.maps.Map(this.engineElement,options);google.maps.event.addListener(this.googleMap,"bounds_changed",function(){self.onBoundsChanged();});if(this.settings.bicycle==1)
this.enableBicycleLayer(true);if(this.settings.traffic==1)
this.enableTrafficLayer(true);if(this.settings.transport_layer)
this.enablePublicTransportLayer(true);this.showPointsOfInterest(this.settings.wpgmza_show_point_of_interest);$(this.engineElement).append($(this.element).find(".wpgmza-loader"));}
WPGMZA.GoogleMap.prototype.setOptions=function(options,initializing)
{Parent.prototype.setOptions.call(this,options);if(options.scrollwheel)
delete options.scrollwheel;if(!initializing)
{this.googleMap.setOptions(options);return;}
var converted=$.extend(options,this.settings.toGoogleMapsOptions());var clone=$.extend({},converted);if(!clone.center instanceof google.maps.LatLng&&(clone.center instanceof WPGMZA.LatLng||typeof clone.center=="object"))
clone.center={lat:parseFloat(clone.center.lat),lng:parseFloat(clone.center.lng)};if(this.settings.hide_point_of_interest)
{var noPoi={featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]};if(!clone.styles)
clone.styles=[];clone.styles.push(noPoi);}
this.googleMap.setOptions(clone);}
WPGMZA.GoogleMap.prototype.addMarker=function(marker)
{marker.googleMarker.setMap(this.googleMap);Parent.prototype.addMarker.call(this,marker);}
WPGMZA.GoogleMap.prototype.removeMarker=function(marker)
{marker.googleMarker.setMap(null);Parent.prototype.removeMarker.call(this,marker);}
WPGMZA.GoogleMap.prototype.addPolygon=function(polygon)
{polygon.googlePolygon.setMap(this.googleMap);Parent.prototype.addPolygon.call(this,polygon);}
WPGMZA.GoogleMap.prototype.removePolygon=function(polygon)
{polygon.googlePolygon.setMap(null);Parent.prototype.removePolygon.call(this,polygon);}
WPGMZA.GoogleMap.prototype.addPolyline=function(polyline)
{polyline.googlePolyline.setMap(this.googleMap);Parent.prototype.addPolyline.call(this,polyline);}
WPGMZA.GoogleMap.prototype.removePolyline=function(polyline)
{polyline.googlePolyline.setMap(null);Parent.prototype.removePolyline.call(this,polyline);}
WPGMZA.GoogleMap.prototype.addCircle=function(circle)
{circle.googleCircle.setMap(this.googleMap);Parent.prototype.addCircle.call(this,circle);}
WPGMZA.GoogleMap.prototype.removeCircle=function(circle)
{circle.googleCircle.setMap(null);Parent.prototype.removeCircle.call(this,circle);}
WPGMZA.GoogleMap.prototype.addRectangle=function(rectangle)
{rectangle.googleRectangle.setMap(this.googleMap);Parent.prototype.addRectangle.call(this,rectangle);}
WPGMZA.GoogleMap.prototype.removeRectangle=function(rectangle)
{rectangle.googleRectangle.setMap(null);Parent.prototype.removeRectangle.call(this,rectangle);}
WPGMZA.GoogleMap.prototype.getCenter=function()
{var latLng=this.googleMap.getCenter();return{lat:latLng.lat(),lng:latLng.lng()};}
WPGMZA.GoogleMap.prototype.setCenter=function(latLng)
{WPGMZA.Map.prototype.setCenter.call(this,latLng);if(latLng instanceof WPGMZA.LatLng)
this.googleMap.setCenter({lat:latLng.lat,lng:latLng.lng});else
this.googleMap.setCenter(latLng);}
WPGMZA.GoogleMap.prototype.panTo=function(latLng)
{if(latLng instanceof WPGMZA.LatLng)
this.googleMap.panTo({lat:latLng.lat,lng:latLng.lng});else
this.googleMap.panTo(latLng);}
WPGMZA.GoogleMap.prototype.getZoom=function()
{return this.googleMap.getZoom();}
WPGMZA.GoogleMap.prototype.setZoom=function(value)
{if(isNaN(value))
throw new Error("Value must not be NaN");return this.googleMap.setZoom(parseInt(value));}
WPGMZA.GoogleMap.prototype.getBounds=function(){var nativeBounds=new WPGMZA.LatLngBounds({});try{var bounds=this.googleMap.getBounds();var northEast=bounds.getNorthEast();var southWest=bounds.getSouthWest();nativeBounds.north=northEast.lat();nativeBounds.south=southWest.lat();nativeBounds.west=southWest.lng();nativeBounds.east=northEast.lng();nativeBounds.topLeft={lat:northEast.lat(),lng:southWest.lng()};nativeBounds.bottomRight={lat:southWest.lat(),lng:northEast.lng()};}catch(ex){}
return nativeBounds;}
WPGMZA.GoogleMap.prototype.fitBounds=function(southWest,northEast)
{if(southWest instanceof WPGMZA.LatLng)
southWest={lat:southWest.lat,lng:southWest.lng};if(northEast instanceof WPGMZA.LatLng)
northEast={lat:northEast.lat,lng:northEast.lng};else if(southWest instanceof WPGMZA.LatLngBounds)
{var bounds=southWest;southWest={lat:bounds.south,lng:bounds.west};northEast={lat:bounds.north,lng:bounds.east};}
var nativeBounds=new google.maps.LatLngBounds(southWest,northEast);this.googleMap.fitBounds(nativeBounds);}
WPGMZA.GoogleMap.prototype.fitBoundsToVisibleMarkers=function()
{var bounds=new google.maps.LatLngBounds();for(var i=0;i<this.markers.length;i++)
{if(markers[i].getVisible())
bounds.extend(markers[i].getPosition());}
this.googleMap.fitBounds(bounds);}
WPGMZA.GoogleMap.prototype.enableBicycleLayer=function(enable)
{if(!this.bicycleLayer)
this.bicycleLayer=new google.maps.BicyclingLayer();this.bicycleLayer.setMap(enable?this.googleMap:null);}
WPGMZA.GoogleMap.prototype.enableTrafficLayer=function(enable)
{if(!this.trafficLayer)
this.trafficLayer=new google.maps.TrafficLayer();this.trafficLayer.setMap(enable?this.googleMap:null);}
WPGMZA.GoogleMap.prototype.enablePublicTransportLayer=function(enable)
{if(!this.publicTransportLayer)
this.publicTransportLayer=new google.maps.TransitLayer();this.publicTransportLayer.setMap(enable?this.googleMap:null);}
WPGMZA.GoogleMap.prototype.showPointsOfInterest=function(show)
{var text=$("textarea[name='theme_data']").val();if(!text)
return;var styles=JSON.parse(text);styles.push({featureType:"poi",stylers:[{visibility:(show?"on":"off")}]});this.googleMap.setOptions({styles:styles});}
WPGMZA.GoogleMap.prototype.getMinZoom=function()
{return parseInt(this.settings.min_zoom);}
WPGMZA.GoogleMap.prototype.setMinZoom=function(value)
{this.googleMap.setOptions({minZoom:value,maxZoom:this.getMaxZoom()});}
WPGMZA.GoogleMap.prototype.getMaxZoom=function()
{return parseInt(this.settings.max_zoom);}
WPGMZA.GoogleMap.prototype.setMaxZoom=function(value)
{this.googleMap.setOptions({minZoom:this.getMinZoom(),maxZoom:value});}
WPGMZA.GoogleMap.prototype.latLngToPixels=function(latLng)
{var map=this.googleMap;var nativeLatLng=new google.maps.LatLng({lat:parseFloat(latLng.lat),lng:parseFloat(latLng.lng)});var topRight=map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());var bottomLeft=map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());var scale=Math.pow(2,map.getZoom());var worldPoint=map.getProjection().fromLatLngToPoint(nativeLatLng);return{x:(worldPoint.x-bottomLeft.x)*scale,y:(worldPoint.y-topRight.y)*scale};}
WPGMZA.GoogleMap.prototype.pixelsToLatLng=function(x,y)
{if(y==undefined)
{if("x"in x&&"y"in x)
{y=x.y;x=x.x;}
else
console.warn("Y coordinate undefined in pixelsToLatLng (did you mean to pass 2 arguments?)");}
var map=this.googleMap;var topRight=map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());var bottomLeft=map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());var scale=Math.pow(2,map.getZoom());var worldPoint=new google.maps.Point(x/scale+bottomLeft.x,y/scale+topRight.y);var latLng=map.getProjection().fromPointToLatLng(worldPoint);return{lat:latLng.lat(),lng:latLng.lng()};}
WPGMZA.GoogleMap.prototype.onElementResized=function(event)
{if(!this.googleMap)
return;google.maps.event.trigger(this.googleMap,"resize");}
WPGMZA.GoogleMap.prototype.enableAllInteractions=function()
{var options={};options.scrollwheel=true;options.draggable=true;options.disableDoubleClickZoom=false;this.googleMap.setOptions(options);}});