jQuery(function($){WPGMZA.Map=function(element,options)
{var self=this;WPGMZA.assertInstanceOf(this,"Map");WPGMZA.EventDispatcher.call(this);if(!(element instanceof HTMLElement)){if(!window.elementor){throw new Error("Argument must be a HTMLElement");}}
if(element.hasAttribute("data-map-id"))
this.id=element.getAttribute("data-map-id");else
this.id=1;if(!/\d+/.test(this.id))
throw new Error("Map ID must be an integer");WPGMZA.maps.push(this);this.element=element;this.element.wpgmzaMap=this;$(this.element).addClass("wpgmza-initialized");this.engineElement=element;this.markers=[];this.polygons=[];this.polylines=[];this.circles=[];this.rectangles=[];if(WPGMZA.googleAPIStatus&&WPGMZA.googleAPIStatus.code=="USER_CONSENT_NOT_GIVEN"){$(element).append($(WPGMZA.api_consent_html));$(element).css({height:"auto"});return;}
this.loadSettings(options);this.shortcodeAttributes={};if($(this.element).attr("data-shortcode-attributes")){try{this.shortcodeAttributes=JSON.parse($(this.element).attr("data-shortcode-attributes"));if(this.shortcodeAttributes.zoom){this.settings.map_start_zoom=parseInt(this.shortcodeAttributes.zoom);}}catch(e){console.warn("Error parsing shortcode attributes");}}
if(WPGMZA.getCurrentPage()!=WPGMZA.PAGE_MAP_EDIT)
this.initStoreLocator();this.setDimensions();this.setAlignment();this.markerFilter=WPGMZA.MarkerFilter.createInstance(this);this.on("init",function(event){self.onInit(event);});this.on("click",function(event){self.onClick(event);});if(WPGMZA.useLegacyGlobals)
{wpgmzaLegacyGlobals.MYMAP[this.id]={map:null,bounds:null,mc:null};wpgmzaLegacyGlobals.MYMAP.init=wpgmzaLegacyGlobals.MYMAP[this.id].init=wpgmzaLegacyGlobals.MYMAP.placeMarkers=wpgmzaLegacyGlobals.MYMAP[this.id].placeMarkers=function(){console.warn("This function is deprecated and should no longer be used");}}}
WPGMZA.Map.prototype=Object.create(WPGMZA.EventDispatcher.prototype);WPGMZA.Map.prototype.constructor=WPGMZA.Map;WPGMZA.Map.nightTimeThemeData=[{"elementType":"geometry","stylers":[{"color":"#242f3e"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#746855"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#242f3e"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#575663"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#263c3f"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#6b9a76"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#38414e"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#212a37"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#9ca5b3"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#746855"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#80823e"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#1f2835"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#f3d19c"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#2f3948"}]},{"featureType":"transit.station","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#17263c"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#1b737a"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#515c6d"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#17263c"}]}];WPGMZA.Map.getConstructor=function()
{switch(WPGMZA.settings.engine)
{case"open-layers":if(WPGMZA.isProVersion())
return WPGMZA.OLProMap;return WPGMZA.OLMap;break;default:if(WPGMZA.isProVersion())
return WPGMZA.GoogleProMap;return WPGMZA.GoogleMap;break;}}
WPGMZA.Map.createInstance=function(element,options)
{var constructor=WPGMZA.Map.getConstructor();return new constructor(element,options);}
Object.defineProperty(WPGMZA.Map.prototype,"markersPlaced",{get:function(){return this._markersPlaced;},set:function(value){throw new Error("Value is read only");}});Object.defineProperty(WPGMZA.Map.prototype,"lat",{get:function(){return this.getCenter().lat;},set:function(value){var center=this.getCenter();center.lat=value;this.setCenter(center);}});Object.defineProperty(WPGMZA.Map.prototype,"lng",{get:function(){return this.getCenter().lng;},set:function(value){var center=this.getCenter();center.lng=value;this.setCenter(center);}});Object.defineProperty(WPGMZA.Map.prototype,"zoom",{get:function(){return this.getZoom();},set:function(value){this.setZoom(value);}});WPGMZA.Map.prototype.onInit=function(event)
{var self=this;this.initPreloader();if(!("autoFetchFeatures"in this.settings)||(this.settings.autoFetchFeatures!==false))
this.fetchFeatures();}
WPGMZA.Map.prototype.initPreloader=function()
{this.preloader=$(WPGMZA.preloaderHTML);$(this.preloader).hide();$(this.element).append(this.preloader);}
WPGMZA.Map.prototype.showPreloader=function(show)
{if(show)
$(this.preloader).show();else
$(this.preloader).hide();}
WPGMZA.Map.prototype.loadSettings=function(options)
{var settings=new WPGMZA.MapSettings(this.element);var other_settings=settings.other_settings;delete settings.other_settings;if(options)
for(var key in options)
settings[key]=options[key];this.settings=settings;}
WPGMZA.Map.prototype.initStoreLocator=function()
{var storeLocatorElement=$(".wpgmza_sl_main_div");if(storeLocatorElement.length)
this.storeLocator=WPGMZA.StoreLocator.createInstance(this,storeLocatorElement[0]);}
WPGMZA.Map.prototype.getFeatureArrays=function()
{var arrays=WPGMZA.Map.prototype.getFeatureArrays.call(this);arrays.heatmaps=this.heatmaps;return arrays;}
WPGMZA.Map.prototype.setOptions=function(options)
{for(var name in options)
this.settings[name]=options[name];}
WPGMZA.Map.prototype.getRESTParameters=function(options)
{var defaults={};if(!options||!options.filter)
defaults.filter=JSON.stringify(this.markerFilter.getFilteringParameters());return $.extend(true,defaults,options);}
WPGMZA.Map.prototype.fetchFeaturesViaREST=function()
{var self=this;var data;var filter=this.markerFilter.getFilteringParameters();if(WPGMZA.is_admin=="1")
{filter.includeUnapproved=true;filter.excludeIntegrated=true;}
if(this.shortcodeAttributes.acf_post_id)
filter.acfPostID=this.shortcodeAttributes.acf_post_id;this.showPreloader(true);if(this.fetchFeaturesXhr)
this.fetchFeaturesXhr.abort();if(!WPGMZA.settings.fetchMarkersBatchSize)
{data=this.getRESTParameters({filter:JSON.stringify(filter)});this.fetchFeaturesXhr=WPGMZA.restAPI.call("/features/",{useCompressedPathVariable:true,data:data,success:function(result,status,xhr){self.onFeaturesFetched(result);}});}
else
{var offset=0;var limit=WPGMZA.settings.fetchMarkersBatchSize;function fetchNextBatch()
{filter.offset=offset;filter.limit=limit;data=self.getRESTParameters({filter:JSON.stringify(filter)});self.fetchFeaturesXhr=WPGMZA.restAPI.call("/markers/",{useCompressedPathVariable:true,data:data,success:function(result,status,xhr){if(result.length)
{self.onMarkersFetched(result,true);offset+=limit;fetchNextBatch();}
else
{self.onMarkersFetched(result);data.exclude="markers";WPGMZA.restAPI.call("/features/",{useCompressedPathVariable:true,data:data,success:function(result,status,xhr){self.onFeaturesFetched(result);}});}}});}
fetchNextBatch();}}
WPGMZA.Map.prototype.fetchFeaturesViaXML=function()
{var self=this;var urls=[WPGMZA.markerXMLPathURL+this.id+"markers.xml"];if(this.mashupIDs)
this.mashupIDs.forEach(function(id){urls.push(WPGMZA.markerXMLPathURL+id+"markers.xml")});var unique=urls.filter(function(item,index){return urls.indexOf(item)==index;});urls=unique;function fetchFeaturesExcludingMarkersViaREST()
{var filter={map_id:this.id,mashup_ids:this.mashupIDs};var data={filter:JSON.stringify(filter),exclude:"markers"};WPGMZA.restAPI.call("/features/",{useCompressedPathVariable:true,data:data,success:function(result,status,xhr){self.onFeaturesFetched(result);}});}
if(window.Worker&&window.Blob&&window.URL&&WPGMZA.settings.enable_asynchronous_xml_parsing)
{var source=WPGMZA.loadXMLAsWebWorker.toString().replace(/function\(\)\s*{([\s\S]+)}/,"$1");var blob=new Blob([source],{type:"text/javascript"});var worker=new Worker(URL.createObjectURL(blob));worker.onmessage=function(event){self.onMarkersFetched(event.data);fetchFeaturesExcludingMarkersViaREST();};worker.postMessage({command:"load",protocol:window.location.protocol,urls:urls});}
else
{var filesLoaded=0;var converter=new WPGMZA.XMLCacheConverter();var converted=[];for(var i=0;i<urls.length;i++)
{$.ajax(urls[i],{success:function(response,status,xhr){converted=converted.concat(converter.convert(response));if(++filesLoaded==urls.length)
{self.onMarkersFetched(converted);fetchFeaturesExcludingMarkersViaREST();}}});}}}
WPGMZA.Map.prototype.fetchFeatures=function()
{var self=this;if(WPGMZA.settings.wpgmza_settings_marker_pull!=WPGMZA.MARKER_PULL_XML||WPGMZA.is_admin=="1")
{this.fetchFeaturesViaREST();}
else
{this.fetchFeaturesViaXML();}}
WPGMZA.Map.prototype.onFeaturesFetched=function(data)
{if(data.markers)
this.onMarkersFetched(data.markers);for(var type in data)
{if(type=="markers")
continue;var module=type.substr(0,1).toUpperCase()+type.substr(1).replace(/s$/,"");for(var i=0;i<data[type].length;i++)
{var instance=WPGMZA[module].createInstance(data[type][i]);var addFunctionName="add"+module;this[addFunctionName](instance);}}}
WPGMZA.Map.prototype.onMarkersFetched=function(data,expectMoreBatches)
{var self=this;var startFiltered=(this.shortcodeAttributes.cat&&this.shortcodeAttributes.cat.length)
for(var i=0;i<data.length;i++)
{var obj=data[i];var marker=WPGMZA.Marker.createInstance(obj);if(startFiltered)
{marker.isFiltered=true;marker.setVisible(false);}
this.addMarker(marker);}
if(expectMoreBatches)
return;this.showPreloader(false);var triggerEvent=function()
{self._markersPlaced=true;self.trigger("markersplaced");self.off("filteringcomplete",triggerEvent);}
if(this.shortcodeAttributes.cat)
{var categories=this.shortcodeAttributes.cat.split(",");var select=$("select[mid='"+this.id+"'][name='wpgmza_filter_select']");for(var i=0;i<categories.length;i++)
{$("input[type='checkbox'][mid='"+this.id+"'][value='"+categories[i]+"']").prop("checked",true);select.val(categories[i]);}
this.on("filteringcomplete",triggerEvent);this.markerFilter.update({categories:categories});}
else
triggerEvent();if(this.shortcodeAttributes.markers)
{var arr=this.shortcodeAttributes.markers.split(",");var markers=[];for(var i=0;i<arr.length;i++){var id=arr[i];id=id.replace(' ','');var marker=this.getMarkerByID(id);markers.push(marker);}
this.fitMapBoundsToMarkers(markers);}}
WPGMZA.Map.prototype.fetchFeaturesViaXML=function()
{var self=this;var urls=[WPGMZA.markerXMLPathURL+this.id+"markers.xml"];if(this.mashupIDs)
this.mashupIDs.forEach(function(id){urls.push(WPGMZA.markerXMLPathURL+id+"markers.xml")});var unique=urls.filter(function(item,index){return urls.indexOf(item)==index;});urls=unique;function fetchFeaturesExcludingMarkersViaREST()
{var filter={map_id:this.id,mashup_ids:this.mashupIDs};var data={filter:JSON.stringify(filter),exclude:"markers"};WPGMZA.restAPI.call("/features/",{useCompressedPathVariable:true,data:data,success:function(result,status,xhr){self.onFeaturesFetched(result);}});}
if(window.Worker&&window.Blob&&window.URL&&WPGMZA.settings.enable_asynchronous_xml_parsing)
{var source=WPGMZA.loadXMLAsWebWorker.toString().replace(/function\(\)\s*{([\s\S]+)}/,"$1");var blob=new Blob([source],{type:"text/javascript"});var worker=new Worker(URL.createObjectURL(blob));worker.onmessage=function(event){self.onMarkersFetched(event.data);fetchFeaturesExcludingMarkersViaREST();};worker.postMessage({command:"load",protocol:window.location.protocol,urls:urls});}
else
{var filesLoaded=0;var converter=new WPGMZA.XMLCacheConverter();var converted=[];for(var i=0;i<urls.length;i++)
{$.ajax(urls[i],{success:function(response,status,xhr){converted=converted.concat(converter.convert(response));if(++filesLoaded==urls.length)
{self.onMarkersFetched(converted);fetchFeaturesExcludingMarkersViaREST();}}});}}}
WPGMZA.Map.prototype.fetchFeatures=function()
{var self=this;if(WPGMZA.settings.wpgmza_settings_marker_pull!=WPGMZA.MARKER_PULL_XML||WPGMZA.is_admin=="1")
{this.fetchFeaturesViaREST();}
else
{this.fetchFeaturesViaXML();}}
WPGMZA.Map.prototype.onFeaturesFetched=function(data)
{if(data.markers)
this.onMarkersFetched(data.markers);for(var type in data)
{if(type=="markers")
continue;var module=type.substr(0,1).toUpperCase()+type.substr(1).replace(/s$/,"");for(var i=0;i<data[type].length;i++)
{var instance=WPGMZA[module].createInstance(data[type][i]);var addFunctionName="add"+module;this[addFunctionName](instance);}}}
WPGMZA.Map.prototype.onMarkersFetched=function(data,expectMoreBatches)
{var self=this;var startFiltered=(this.shortcodeAttributes.cat&&this.shortcodeAttributes.cat.length)
for(var i=0;i<data.length;i++)
{var obj=data[i];var marker=WPGMZA.Marker.createInstance(obj);if(startFiltered)
{marker.isFiltered=true;marker.setVisible(false);}
this.addMarker(marker);}
if(expectMoreBatches)
return;this.showPreloader(false);var triggerEvent=function()
{self._markersPlaced=true;self.trigger("markersplaced");self.off("filteringcomplete",triggerEvent);}
if(this.shortcodeAttributes.cat)
{var categories=this.shortcodeAttributes.cat.split(",");var select=$("select[mid='"+this.id+"'][name='wpgmza_filter_select']");for(var i=0;i<categories.length;i++)
{$("input[type='checkbox'][mid='"+this.id+"'][value='"+categories[i]+"']").prop("checked",true);select.val(categories[i]);}
this.on("filteringcomplete",triggerEvent);this.markerFilter.update({categories:categories});}
else
triggerEvent();if(this.shortcodeAttributes.markers)
{var arr=this.shortcodeAttributes.markers.split(",");var markers=[];for(var i=0;i<arr.length;i++){var id=arr[i];id=id.replace(' ','');var marker=this.getMarkerByID(id);markers.push(marker);}
this.fitMapBoundsToMarkers(markers);}}
var earthRadiusMeters=6371;var piTimes360=Math.PI/360;function deg2rad(deg){return deg*(Math.PI/180)};WPGMZA.Map.getGeographicDistance=function(lat1,lon1,lat2,lon2)
{var dLat=deg2rad(lat2-lat1);var dLon=deg2rad(lon2-lon1);var a=Math.sin(dLat/2)*Math.sin(dLat/2)+
Math.cos(deg2rad(lat1))*Math.cos(deg2rad(lat2))*Math.sin(dLon/2)*Math.sin(dLon/2);var c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));var d=earthRadiusMeters*c;return d;}
WPGMZA.Map.prototype.setCenter=function(latLng)
{if(!("lat"in latLng&&"lng"in latLng))
throw new Error("Argument is not an object with lat and lng");}
WPGMZA.Map.prototype.setDimensions=function(width,height)
{if(arguments.length==0)
{if(this.settings.map_width)
width=this.settings.map_width;else
width="100";if(this.settings.map_width_type)
width+=this.settings.map_width_type.replace("\\","");else
width+="%";if(this.settings.map_height)
height=this.settings.map_height;else
height="400";if(this.settings.map_height_type)
height+=this.settings.map_height_type.replace("\\","");else
height+="px";}
$(this.engineElement).css({width:width,height:height});}
WPGMZA.Map.prototype.setAlignment=function()
{switch(parseInt(this.settings.wpgmza_map_align))
{case 1:$(this.element).css({"float":"left"});break;case 2:$(this.element).css({"margin-left":"auto","margin-right":"auto"});break;case 3:$(this.element).css({"float":"right"});break;default:break;}}
WPGMZA.Map.prototype.addMarker=function(marker)
{if(!(marker instanceof WPGMZA.Marker))
throw new Error("Argument must be an instance of WPGMZA.Marker");marker.map=this;marker.parent=this;this.markers.push(marker);this.dispatchEvent({type:"markeradded",marker:marker});marker.dispatchEvent({type:"added"});}
WPGMZA.Map.prototype.removeMarker=function(marker)
{if(!(marker instanceof WPGMZA.Marker))
throw new Error("Argument must be an instance of WPGMZA.Marker");if(marker.map!==this)
throw new Error("Wrong map error");if(marker.infoWindow)
marker.infoWindow.close();marker.map=null;marker.parent=null;var index=this.markers.indexOf(marker);if(index==-1)
throw new Error("Marker not found in marker array");this.markers.splice(index,1);this.dispatchEvent({type:"markerremoved",marker:marker});marker.dispatchEvent({type:"removed"});}
WPGMZA.Map.prototype.removeAllMarkers=function(options)
{for(var i=this.markers.length-1;i>=0;i--)
this.removeMarker(this.markers[i]);}
WPGMZA.Map.prototype.getMarkerByID=function(id)
{for(var i=0;i<this.markers.length;i++)
{if(this.markers[i].id==id)
return this.markers[i];}
return null;}
WPGMZA.Map.prototype.getMarkerByTitle=function(title)
{if(typeof title=="string")
for(var i=0;i<this.markers.length;i++)
{if(this.markers[i].title==title)
return this.markers[i];}
else if(title instanceof RegExp)
for(var i=0;i<this.markers.length;i++)
{if(title.test(this.markers[i].title))
return this.markers[i];}
else
throw new Error("Invalid argument");return null;}
WPGMZA.Map.prototype.removeMarkerByID=function(id)
{var marker=this.getMarkerByID(id);if(!marker)
return;this.removeMarker(marker);}
WPGMZA.Map.prototype.addPolygon=function(polygon)
{if(!(polygon instanceof WPGMZA.Polygon))
throw new Error("Argument must be an instance of WPGMZA.Polygon");polygon.map=this;this.polygons.push(polygon);this.dispatchEvent({type:"polygonadded",polygon:polygon});}
WPGMZA.Map.prototype.removePolygon=function(polygon)
{if(!(polygon instanceof WPGMZA.Polygon))
throw new Error("Argument must be an instance of WPGMZA.Polygon");if(polygon.map!==this)
throw new Error("Wrong map error");polygon.map=null;this.polygons.splice(this.polygons.indexOf(polygon),1);this.dispatchEvent({type:"polygonremoved",polygon:polygon});}
WPGMZA.Map.prototype.getPolygonByID=function(id)
{for(var i=0;i<this.polygons.length;i++)
{if(this.polygons[i].id==id)
return this.polygons[i];}
return null;}
WPGMZA.Map.prototype.removePolygonByID=function(id)
{var polygon=this.getPolygonByID(id);if(!polygon)
return;this.removePolygon(polygon);}
WPGMZA.Map.prototype.getPolylineByID=function(id)
{for(var i=0;i<this.polylines.length;i++)
{if(this.polylines[i].id==id)
return this.polylines[i];}
return null;}
WPGMZA.Map.prototype.addPolyline=function(polyline)
{if(!(polyline instanceof WPGMZA.Polyline))
throw new Error("Argument must be an instance of WPGMZA.Polyline");polyline.map=this;this.polylines.push(polyline);this.dispatchEvent({type:"polylineadded",polyline:polyline});}
WPGMZA.Map.prototype.removePolyline=function(polyline)
{if(!(polyline instanceof WPGMZA.Polyline))
throw new Error("Argument must be an instance of WPGMZA.Polyline");if(polyline.map!==this)
throw new Error("Wrong map error");polyline.map=null;this.polylines.splice(this.polylines.indexOf(polyline),1);this.dispatchEvent({type:"polylineremoved",polyline:polyline});}
WPGMZA.Map.prototype.getPolylineByID=function(id)
{for(var i=0;i<this.polylines.length;i++)
{if(this.polylines[i].id==id)
return this.polylines[i];}
return null;}
WPGMZA.Map.prototype.removePolylineByID=function(id)
{var polyline=this.getPolylineByID(id);if(!polyline)
return;this.removePolyline(polyline);}
WPGMZA.Map.prototype.addCircle=function(circle)
{if(!(circle instanceof WPGMZA.Circle))
throw new Error("Argument must be an instance of WPGMZA.Circle");circle.map=this;this.circles.push(circle);this.dispatchEvent({type:"circleadded",circle:circle});}
WPGMZA.Map.prototype.removeCircle=function(circle)
{if(!(circle instanceof WPGMZA.Circle))
throw new Error("Argument must be an instance of WPGMZA.Circle");if(circle.map!==this)
throw new Error("Wrong map error");circle.map=null;this.circles.splice(this.circles.indexOf(circle),1);this.dispatchEvent({type:"circleremoved",circle:circle});}
WPGMZA.Map.prototype.getCircleByID=function(id)
{for(var i=0;i<this.circles.length;i++)
{if(this.circles[i].id==id)
return this.circles[i];}
return null;}
WPGMZA.Map.prototype.removeCircleByID=function(id)
{var circle=this.getCircleByID(id);if(!circle)
return;this.removeCircle(circle);}
WPGMZA.Map.prototype.addRectangle=function(rectangle)
{if(!(rectangle instanceof WPGMZA.Rectangle))
throw new Error("Argument must be an instance of WPGMZA.Rectangle");rectangle.map=this;this.rectangles.push(rectangle);this.dispatchEvent({type:"rectangleadded",rectangle:rectangle});}
WPGMZA.Map.prototype.removeRectangle=function(rectangle)
{if(!(rectangle instanceof WPGMZA.Rectangle))
throw new Error("Argument must be an instance of WPGMZA.Rectangle");if(rectangle.map!==this)
throw new Error("Wrong map error");rectangle.map=null;this.rectangles.splice(this.rectangles.indexOf(rectangle),1);this.dispatchEvent({type:"rectangleremoved",rectangle:rectangle});}
WPGMZA.Map.prototype.getRectangleByID=function(id)
{for(var i=0;i<this.rectangles.length;i++)
{if(this.rectangles[i].id==id)
return this.rectangles[i];}
return null;}
WPGMZA.Map.prototype.removeRectangleByID=function(id)
{var rectangle=this.getRectangleByID(id);if(!rectangle)
return;this.removeRectangle(rectangle);}
WPGMZA.Map.prototype.resetBounds=function()
{var latlng=new WPGMZA.LatLng(this.settings.map_start_lat,this.settings.map_start_lng);this.panTo(latlng);this.setZoom(this.settings.map_start_zoom);}
WPGMZA.Map.prototype.nudge=function(x,y)
{var nudged=this.nudgeLatLng(this.getCenter(),x,y);this.setCenter(nudged);}
WPGMZA.Map.prototype.nudgeLatLng=function(latLng,x,y)
{var pixels=this.latLngToPixels(latLng);pixels.x+=parseFloat(x);pixels.y+=parseFloat(y);if(isNaN(pixels.x)||isNaN(pixels.y))
throw new Error("Invalid coordinates supplied");return this.pixelsToLatLng(pixels);}
WPGMZA.Map.prototype.animateNudge=function(x,y,origin,milliseconds)
{var nudged;if(!origin)
origin=this.getCenter();else if(!(origin instanceof WPGMZA.LatLng))
throw new Error("Origin must be an instance of WPGMZA.LatLng");nudged=this.nudgeLatLng(origin,x,y);if(!milliseconds)
milliseconds=WPGMZA.getScrollAnimationDuration();$(this).animate({lat:nudged.lat,lng:nudged.lng},milliseconds);}
WPGMZA.Map.prototype.onWindowResize=function(event)
{}
WPGMZA.Map.prototype.onElementResized=function(event)
{}
WPGMZA.Map.prototype.onBoundsChanged=function(event)
{this.trigger("boundschanged");this.trigger("bounds_changed");}
WPGMZA.Map.prototype.onIdle=function(event)
{this.trigger("idle");}
WPGMZA.Map.prototype.onClick=function(event){}
WPGMZA.Map.prototype.hasVisibleMarkers=function()
{var length=this.markers.length,marker;for(var i=0;i<length;i++)
{marker=this.markers[i];if(marker.isFilterable&&marker.getVisible())
return true;}
return false;}
WPGMZA.Map.prototype.closeAllInfoWindows=function()
{this.markers.forEach(function(marker){if(marker.infoWindow)
marker.infoWindow.close();});}
$(document).ready(function(event){if(!WPGMZA.visibilityWorkaroundIntervalID)
{var invisibleMaps=jQuery(".wpgmza_map:hidden");WPGMZA.visibilityWorkaroundIntervalID=setInterval(function(){jQuery(invisibleMaps).each(function(index,el){if(jQuery(el).is(":visible"))
{var id=jQuery(el).attr("data-map-id");var map=WPGMZA.getMapByID(id);map.onElementResized();invisibleMaps.splice(invisibleMaps.toArray().indexOf(el),1);}});},1000);}});});