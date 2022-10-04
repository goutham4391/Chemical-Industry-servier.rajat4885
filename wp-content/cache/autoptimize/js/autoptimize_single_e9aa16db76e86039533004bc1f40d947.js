jQuery(function($){var Parent;WPGMZA.OLMap=function(element,options)
{var self=this;Parent.call(this,element);this.setOptions(options);var viewOptions=this.settings.toOLViewOptions();$(this.element).html("");this.olMap=new ol.Map({target:$(element)[0],layers:[this.getTileLayer()],view:new ol.View(viewOptions)});function isSettingDisabled(value)
{if(value==="yes")
return true;return(value?true:false);}
this.olMap.getInteractions().forEach(function(interaction){if(interaction instanceof ol.interaction.DragPan)
interaction.setActive(!isSettingDisabled(self.settings.wpgmza_settings_map_draggable));else if(interaction instanceof ol.interaction.DoubleClickZoom)
interaction.setActive(!isSettingDisabled(self.settings.wpgmza_settings_map_clickzoom));else if(interaction instanceof ol.interaction.MouseWheelZoom)
interaction.setActive(!isSettingDisabled(self.settings.wpgmza_settings_map_scroll));},this);if(!(this.settings.wpgmza_force_greedy_gestures=="greedy"||this.settings.wpgmza_force_greedy_gestures=="yes"||this.settings.wpgmza_force_greedy_gestures==true))
{this.gestureOverlay=$("<div class='wpgmza-gesture-overlay'></div>")
this.gestureOverlayTimeoutID=null;if(WPGMZA.isTouchDevice())
{}
else
{this.olMap.on("wheel",function(event){if(!ol.events.condition.platformModifierKeyOnly(event))
{self.showGestureOverlay();event.originalEvent.preventDefault();return false;}});this.gestureOverlay.text(WPGMZA.localized_strings.use_ctrl_scroll_to_zoom);}}
this.olMap.getControls().forEach(function(control){if(control instanceof ol.control.Zoom&&WPGMZA.settings.wpgmza_settings_map_zoom==true)
self.olMap.removeControl(control);},this);if(!isSettingDisabled(WPGMZA.settings.wpgmza_settings_map_full_screen_control))
this.olMap.addControl(new ol.control.FullScreen());if(WPGMZA.OLMarker.renderMode==WPGMZA.OLMarker.RENDER_MODE_VECTOR_LAYER)
{this.markerLayer=new ol.layer.Vector({source:new ol.source.Vector({features:[]})});this.olMap.addLayer(this.markerLayer);this.olMap.on("click",function(event){var features=self.olMap.getFeaturesAtPixel(event.pixel);if(!features||!features.length)
return;var marker=features[0].wpgmzaMarker;if(!marker){return;}
marker.trigger("click");marker.trigger("select");});}
this.olMap.on("movestart",function(event){self.isBeingDragged=true;});this.olMap.on("moveend",function(event){self.wrapLongitude();self.isBeingDragged=false;self.dispatchEvent("dragend");self.onIdle();});this.olMap.getView().on("change:resolution",function(event){self.dispatchEvent("zoom_changed");self.dispatchEvent("zoomchanged");setTimeout(function(){self.onIdle();},10);});this.olMap.getView().on("change",function(){self.onBoundsChanged();});self.onBoundsChanged();this._mouseoverNativeFeatures=[];this.olMap.on("pointermove",function(event){if(event.dragging)
return;try{var featuresUnderPixel=event.target.getFeaturesAtPixel(event.pixel);}catch(e){return;}
if(!featuresUnderPixel)
featuresUnderPixel=[];var nativeFeaturesUnderPixel=[],i,props;for(i=0;i<featuresUnderPixel.length;i++)
{props=featuresUnderPixel[i].getProperties();if(!props.wpgmzaFeature)
continue;nativeFeature=props.wpgmzaFeature;nativeFeaturesUnderPixel.push(nativeFeature);if(self._mouseoverNativeFeatures.indexOf(nativeFeature)==-1)
{nativeFeature.trigger("mouseover");self._mouseoverNativeFeatures.push(nativeFeature);}}
for(i=self._mouseoverNativeFeatures.length-1;i>=0;i--)
{nativeFeature=self._mouseoverNativeFeatures[i];if(nativeFeaturesUnderPixel.indexOf(nativeFeature)==-1)
{nativeFeature.trigger("mouseout");self._mouseoverNativeFeatures.splice(i,1);}}});$(this.element).on("click contextmenu",function(event){var isRight;event=event||window.event;var latLng=self.pixelsToLatLng(event.offsetX,event.offsetY);if("which"in event)
isRight=event.which==3;else if("button"in event)
isRight=event.button==2;if(event.which==1||event.button==1){if(self.isBeingDragged)
return;if($(event.target).closest(".ol-marker").length)
return;try{var featuresUnderPixel=self.olMap.getFeaturesAtPixel([event.offsetX,event.offsetY]);}catch(e){return;}
if(!featuresUnderPixel)
featuresUnderPixel=[];var nativeFeaturesUnderPixel=[],i,props;for(i=0;i<featuresUnderPixel.length;i++){props=featuresUnderPixel[i].getProperties();if(!props.wpgmzaFeature)
continue;nativeFeature=props.wpgmzaFeature;nativeFeaturesUnderPixel.push(nativeFeature);nativeFeature.trigger("click");}
if(featuresUnderPixel.length>0){return;}
self.trigger({type:"click",latLng:latLng});return;}
if(!isRight){return;}
return self.onRightClick(event);});if(!WPGMZA.isProVersion())
{this.trigger("init");this.dispatchEvent("created");WPGMZA.events.dispatchEvent({type:"mapcreated",map:this});$(this.element).trigger("wpgooglemaps_loaded");}}
if(WPGMZA.isProVersion())
Parent=WPGMZA.ProMap;else
Parent=WPGMZA.Map;WPGMZA.OLMap.prototype=Object.create(Parent.prototype);WPGMZA.OLMap.prototype.constructor=WPGMZA.OLMap;WPGMZA.OLMap.prototype.getTileLayer=function()
{var options={};if(WPGMZA.settings.tile_server_url){options.url=WPGMZA.settings.tile_server_url;if(WPGMZA.settings.tile_server_url==='custom_override'){if(WPGMZA.settings.tile_server_url_override&&WPGMZA.settings.tile_server_url_override.trim()!==""){options.url=WPGMZA.settings.tile_server_url_override.trim();}else{options.url="https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png";}}
if(WPGMZA.settings.open_layers_api_key&&WPGMZA.settings.open_layers_api_key!==""){options.url+="?apikey="+WPGMZA.settings.open_layers_api_key.trim();}}
return new ol.layer.Tile({source:new ol.source.OSM(options)});}
WPGMZA.OLMap.prototype.wrapLongitude=function()
{var transformed=ol.proj.transform(this.olMap.getView().getCenter(),"EPSG:3857","EPSG:4326");var center={lat:transformed[1],lng:transformed[0]};if(center.lng>=-180&&center.lng<=180)
return;center.lng=center.lng-360*Math.floor(center.lng/360);if(center.lng>180)
center.lng-=360;this.setCenter(center);}
WPGMZA.OLMap.prototype.getCenter=function()
{var lonLat=ol.proj.toLonLat(this.olMap.getView().getCenter());return{lat:lonLat[1],lng:lonLat[0]};}
WPGMZA.OLMap.prototype.setCenter=function(latLng)
{var view=this.olMap.getView();WPGMZA.Map.prototype.setCenter.call(this,latLng);view.setCenter(ol.proj.fromLonLat([latLng.lng,latLng.lat]));this.wrapLongitude();this.onBoundsChanged();}
WPGMZA.OLMap.prototype.getBounds=function()
{var bounds=this.olMap.getView().calculateExtent(this.olMap.getSize());var nativeBounds=new WPGMZA.LatLngBounds();var topLeft=ol.proj.toLonLat([bounds[0],bounds[1]]);var bottomRight=ol.proj.toLonLat([bounds[2],bounds[3]]);nativeBounds.north=topLeft[1];nativeBounds.south=bottomRight[1];nativeBounds.west=topLeft[0];nativeBounds.east=bottomRight[0];return nativeBounds;}
WPGMZA.OLMap.prototype.fitBounds=function(southWest,northEast)
{if(southWest instanceof WPGMZA.LatLng)
southWest={lat:southWest.lat,lng:southWest.lng};if(northEast instanceof WPGMZA.LatLng)
northEast={lat:northEast.lat,lng:northEast.lng};else if(southWest instanceof WPGMZA.LatLngBounds)
{var bounds=southWest;southWest={lat:bounds.south,lng:bounds.west};northEast={lat:bounds.north,lng:bounds.east};}
var view=this.olMap.getView();var extent=ol.extent.boundingExtent([ol.proj.fromLonLat([parseFloat(southWest.lng),parseFloat(southWest.lat)]),ol.proj.fromLonLat([parseFloat(northEast.lng),parseFloat(northEast.lat)])]);view.fit(extent,this.olMap.getSize());}
WPGMZA.OLMap.prototype.panTo=function(latLng,zoom)
{var view=this.olMap.getView();var options={center:ol.proj.fromLonLat([parseFloat(latLng.lng),parseFloat(latLng.lat),]),duration:500};if(arguments.length>1)
options.zoom=parseInt(zoom);view.animate(options);}
WPGMZA.OLMap.prototype.getZoom=function()
{return Math.round(this.olMap.getView().getZoom());}
WPGMZA.OLMap.prototype.setZoom=function(value)
{this.olMap.getView().setZoom(value);}
WPGMZA.OLMap.prototype.getMinZoom=function()
{return this.olMap.getView().getMinZoom();}
WPGMZA.OLMap.prototype.setMinZoom=function(value)
{this.olMap.getView().setMinZoom(value);}
WPGMZA.OLMap.prototype.getMaxZoom=function()
{return this.olMap.getView().getMaxZoom();}
WPGMZA.OLMap.prototype.setMaxZoom=function(value)
{this.olMap.getView().setMaxZoom(value);}
WPGMZA.OLMap.prototype.setOptions=function(options)
{Parent.prototype.setOptions.call(this,options);if(!this.olMap)
return;this.olMap.getView().setProperties(this.settings.toOLViewOptions());}
WPGMZA.OLMap.prototype.addMarker=function(marker)
{if(WPGMZA.OLMarker.renderMode==WPGMZA.OLMarker.RENDER_MODE_HTML_ELEMENT)
this.olMap.addOverlay(marker.overlay);else
{this.markerLayer.getSource().addFeature(marker.feature);marker.featureInSource=true;}
Parent.prototype.addMarker.call(this,marker);}
WPGMZA.OLMap.prototype.removeMarker=function(marker)
{if(WPGMZA.OLMarker.renderMode==WPGMZA.OLMarker.RENDER_MODE_HTML_ELEMENT)
this.olMap.removeOverlay(marker.overlay);else
{this.markerLayer.getSource().removeFeature(marker.feature);marker.featureInSource=false;}
Parent.prototype.removeMarker.call(this,marker);}
WPGMZA.OLMap.prototype.addPolygon=function(polygon)
{this.olMap.addLayer(polygon.layer);Parent.prototype.addPolygon.call(this,polygon);}
WPGMZA.OLMap.prototype.removePolygon=function(polygon)
{this.olMap.removeLayer(polygon.layer);Parent.prototype.removePolygon.call(this,polygon);}
WPGMZA.OLMap.prototype.addPolyline=function(polyline)
{this.olMap.addLayer(polyline.layer);Parent.prototype.addPolyline.call(this,polyline);}
WPGMZA.OLMap.prototype.removePolyline=function(polyline)
{this.olMap.removeLayer(polyline.layer);Parent.prototype.removePolyline.call(this,polyline);}
WPGMZA.OLMap.prototype.addCircle=function(circle)
{this.olMap.addLayer(circle.layer);Parent.prototype.addCircle.call(this,circle);}
WPGMZA.OLMap.prototype.removeCircle=function(circle)
{this.olMap.removeLayer(circle.layer);Parent.prototype.removeCircle.call(this,circle);}
WPGMZA.OLMap.prototype.addRectangle=function(rectangle)
{this.olMap.addLayer(rectangle.layer);Parent.prototype.addRectangle.call(this,rectangle);}
WPGMZA.OLMap.prototype.removeRectangle=function(rectangle)
{this.olMap.removeLayer(rectangle.layer);Parent.prototype.removeRectangle.call(this,rectangle);}
WPGMZA.OLMap.prototype.pixelsToLatLng=function(x,y)
{if(y==undefined)
{if("x"in x&&"y"in x)
{y=x.y;x=x.x;}
else
console.warn("Y coordinate undefined in pixelsToLatLng (did you mean to pass 2 arguments?)");}
var coord=this.olMap.getCoordinateFromPixel([x,y]);if(!coord)
return{x:null,y:null};var lonLat=ol.proj.toLonLat(coord);return{lat:lonLat[1],lng:lonLat[0]};}
WPGMZA.OLMap.prototype.latLngToPixels=function(latLng)
{var coord=ol.proj.fromLonLat([latLng.lng,latLng.lat]);var pixel=this.olMap.getPixelFromCoordinate(coord);if(!pixel)
return{x:null,y:null};return{x:pixel[0],y:pixel[1]};}
WPGMZA.OLMap.prototype.enableBicycleLayer=function(value)
{if(value)
{if(!this.bicycleLayer)
this.bicycleLayer=new ol.layer.Tile({source:new ol.source.OSM({url:"http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"})});this.olMap.addLayer(this.bicycleLayer);}
else
{if(!this.bicycleLayer)
return;this.olMap.removeLayer(this.bicycleLayer);}}
WPGMZA.OLMap.prototype.showGestureOverlay=function()
{var self=this;clearTimeout(this.gestureOverlayTimeoutID);$(this.gestureOverlay).stop().animate({opacity:"100"});$(this.element).append(this.gestureOverlay);$(this.gestureOverlay).css({"line-height":$(this.element).height()+"px","opacity":"1.0"});$(this.gestureOverlay).show();this.gestureOverlayTimeoutID=setTimeout(function(){self.gestureOverlay.fadeOut(2000);},2000);}
WPGMZA.OLMap.prototype.onElementResized=function(event)
{this.olMap.updateSize();}
WPGMZA.OLMap.prototype.onRightClick=function(event)
{if($(event.target).closest(".ol-marker, .wpgmza_modern_infowindow, .wpgmza-modern-store-locator").length)
return true;var parentOffset=$(this.element).offset();var relX=event.pageX-parentOffset.left;var relY=event.pageY-parentOffset.top;var latLng=this.pixelsToLatLng(relX,relY);this.trigger({type:"rightclick",latLng:latLng});$(this.element).trigger({type:"rightclick",latLng:latLng});event.preventDefault();return false;}
WPGMZA.OLMap.prototype.enableAllInteractions=function()
{this.olMap.getInteractions().forEach(function(interaction){if(interaction instanceof ol.interaction.DragPan||interaction instanceof ol.interaction.DoubleClickZoom||interaction instanceof ol.interaction.MouseWheelZoom)
{interaction.setActive(true);}},this);}});