jQuery(function($){WPGMZA.ProMap=function(element,options){var self=this;this._markersPlaced=false;this.element=element;WPGMZA.Map.call(this,element,options);this.defaultMarkerIcon=null;if(this.settings.upload_default_marker)
this.defaultMarkerIcon=WPGMZA.MarkerIcon.createInstance(this.settings.upload_default_marker)
this.heatmaps=[];this.showDistanceFromLocation=null;this.initCustomFieldFilterController();this.initUserLocationMarker();this.on("filteringcomplete",function(){self.onFilteringComplete();});this._onMarkersPlaced=function(event){self.onMarkersPlaced(event);}
this.on("markersplaced",this._onMarkersPlaced);if(WPGMZA.CloudAPI&&WPGMZA.CloudAPI.isBeingUsed)
WPGMZA.cloudAPI.call("/load");}
WPGMZA.ProMap.prototype=Object.create(WPGMZA.Map.prototype);WPGMZA.ProMap.prototype.constructor=WPGMZA.ProMap;WPGMZA.ProMap.SHOW_DISTANCE_FROM_USER_LOCATION="user";WPGMZA.ProMap.SHOW_DISTANCE_FROM_SEARCHED_ADDRESS="searched";WPGMZA.ProMap.ControlPosition={TOP_CENTER:1,TOP_LEFT:2,TOP_RIGHT:3,LEFT_TOP:4,RIGHT_TOP:5,LEFT_CENTER:6,RIGHT_CENTER:7,LEFT_BOTTOM:8,RIGHT_BOTTOM:9,BOTTOM_CENTER:10,BOTTOM_LEFT:11,BOTTOM_RIGHT:12};Object.defineProperty(WPGMZA.ProMap.prototype,"mashupIDs",{get:function(){var result=[];var attr=$(this.element).attr("data-mashup-ids");if(attr&&attr.length)
result=result=attr.split(",");return result;}});Object.defineProperty(WPGMZA.ProMap.prototype,"directionsEnabled",{get:function(){return this.settings.directions_enabled==1;}});WPGMZA.ProMap.prototype.onInit=function(event)
{var self=this;WPGMZA.Map.prototype.onInit.apply(this,arguments);this.initDirectionsBox();if(this.shortcodeAttributes.lat&&this.shortcodeAttributes.lng){var latLng=new WPGMZA.LatLng({lat:this.shortcodeAttributes.lat,lng:this.shortcodeAttributes.lng});this.setCenter(latLng);if(this.shortcodeAttributes.mark_center&&this.shortcodeAttributes.mark_center==='true'){var centerMarker=WPGMZA.Marker.createInstance({lat:this.shortcodeAttributes.lat,lng:this.shortcodeAttributes.lng,address:this.shortcodeAttributes.lat+", "+this.shortcodeAttributes.lng});this.addMarker(centerMarker);}}else if(this.shortcodeAttributes.address){var geocoder=WPGMZA.Geocoder.createInstance();geocoder.geocode({address:this.shortcodeAttributes.address},function(results,status){if(status!=WPGMZA.Geocoder.SUCCESS)
{console.warn("Shortcode attribute address could not be geocoded");return;}
self.setCenter(results[0].latLng);});}
var zoom;if(zoom=WPGMZA.getQueryParamValue("mzoom")){this.setZoom(zoom);}
if(WPGMZA.getCurrentPage()!=WPGMZA.PAGE_MAP_EDIT&&this.settings.automatically_pan_to_users_location=="1"){WPGMZA.getCurrentPosition(function(result){if(!self.userLocationMarker){self.initUserLocationMarker(result);}
self.setCenter(new WPGMZA.LatLng({lat:result.coords.latitude,lng:result.coords.longitude}));if(self.settings.override_users_location_zoom_level)
self.setZoom(self.settings.override_users_location_zoom_levels);});}}
WPGMZA.ProMap.prototype.onMarkersPlaced=function(event)
{var self=this;var jumpToNearestMarker=(WPGMZA.is_admin==0&&self.settings.jump_to_nearest_marker_on_initialization==1);if(this.settings.order_markers_by==WPGMZA.MarkerListing.ORDER_BY_DISTANCE||this.settings.show_distance_from_location==1||jumpToNearestMarker)
{WPGMZA.getCurrentPosition(function(result){var location=new WPGMZA.LatLng({lat:result.coords.latitude,lng:result.coords.longitude});self.userLocation=location;self.userLocation.source=WPGMZA.ProMap.SHOW_DISTANCE_FROM_USER_LOCATION;self.showDistanceFromLocation=location;self.updateInfoWindowDistances();if(self.markerListing)
if(self.markersPlaced)
self.markerListing.reload();else
{self.on("markersplaced",function(event){self.markerListing.reload();});}
if(jumpToNearestMarker)
self.panToNearestMarker(location);},function(error){if(self.markerListing)
self.markerListing.reload();});}
if(self.settings.fit_maps_bounds_to_markers&&self.markers.length>0){self.fitBoundsToMarkers();}
self.initMarkerListing();if(this.settings.mass_marker_support==1&&WPGMZA.MarkerClusterer)
{var options={};if(WPGMZA.settings.wpgmza_cluster_advanced_enabled)
{var styles=[];options.gridSize=parseInt(WPGMZA.settings.wpgmza_cluster_grid_size);options.maxZoom=parseInt(WPGMZA.settings.wpgmza_cluster_max_zoom);options.minClusterSize=parseInt(WPGMZA.settings.wpgmza_cluster_min_cluster_size);options.zoomOnClick=WPGMZA.settings.wpgmza_cluster_zoom_click?true:false;for(var i=1;i<=5;i++){level={};level.url=WPGMZA.settings["clusterLevel"+i].replace(/%2F/g,"/");level.width=parseInt(WPGMZA.settings["clusterLevel"+i+"Width"]);level.height=parseInt(WPGMZA.settings["clusterLevel"+i+"Height"]);level.textColor=WPGMZA.settings.wpgmza_cluster_font_color;level.textSize=parseInt(WPGMZA.settings.wpgmza_cluster_font_size);styles.push(level);}
options.styles=styles;}
this.markerClusterer=new WPGMZA.MarkerClusterer(this,null,options);this.markerClusterer.addMarkers(this.markers);}}
WPGMZA.ProMap.prototype.getRESTParameters=function(options)
{var params=WPGMZA.Map.prototype.getRESTParameters.apply(this,arguments);if(this.settings.only_load_markers_within_viewport&&this.initialFetchCompleted)
{params.include="markers";}
return params;}
WPGMZA.ProMap.prototype.fetchFeatures=function()
{var self=this;if(this.settings.only_load_markers_within_viewport)
{this.on("idle",function(event){self.fetchFeaturesViaREST();self.initialFetchCompleted=true;});return;}
WPGMZA.Map.prototype.fetchFeatures.apply(this,arguments);}
WPGMZA.ProMap.prototype.onMarkersFetched=function(data,expectMoreBatches)
{if(this.settings.only_load_markers_within_viewport)
{this.removeAllMarkers();}
WPGMZA.Map.prototype.onMarkersFetched.apply(this,arguments);}
WPGMZA.ProMap.prototype.panToNearestMarker=function(latlng)
{var closestMarker;var distance=Infinity;if(!latlng)
latlng=this.getCenter();for(var i=0;i<this.markers.length;i++){var distanceToMarker=WPGMZA.Distance.between(latlng,this.markers[i].getPosition());if(distanceToMarker<distance)
{closestMarker=this.markers[i];distance=distanceToMarker;}}
if(!closestMarker)
return;this.panTo(closestMarker.getPosition(this.setZoom(7)));}
WPGMZA.ProMap.prototype.fitBoundsToMarkers=function(markers)
{var bounds=new WPGMZA.LatLngBounds();if(!markers)
markers=this.markers;for(var i=0;i<markers.length;i++)
{if(!(markers[i]instanceof WPGMZA.Marker))
throw new Error("Invalid input, not a WPGMZA.Marker");if(!markers[i].isFiltered)
{bounds.extend(markers[i]);}}
this.fitBounds(bounds);}
WPGMZA.ProMap.prototype.fitMapBoundsToMarkers=WPGMZA.ProMap.prototype.fitBoundsToMarkers;WPGMZA.ProMap.prototype.resetBounds=function()
{var latlng=new WPGMZA.LatLng(this.settings.map_start_lat,this.settings.map_start_lng);this.panTo(latlng);this.setZoom(this.settings.map_start_zoom);}
WPGMZA.ProMap.prototype.onFilteringComplete=function()
{if(this.settings.fit_maps_bounds_to_markers_after_filtering=='1')
{var self=this;var areMarkersVisible=false;for(var i=0;i<this.markers.length;i++)
{if(!this.markers[i].isFiltered){areMarkersVisible=true;break;}}
if(areMarkersVisible)
{self.fitBoundsToMarkers();}}}
WPGMZA.ProMap.prototype.initMarkerListing=function()
{if(WPGMZA.is_admin=="1")
return;var markerListingElement=$("[data-wpgmza-marker-listing][id$='_"+this.id+"']");this.markerListing=WPGMZA.MarkerListing.createInstance(this,markerListingElement[0]);this.off("markersplaced",this._onMarkersPlaced);delete this._onMarkersPlaced;}
WPGMZA.ProMap.prototype.initCustomFieldFilterController=function()
{this.customFieldFilterController=WPGMZA.CustomFieldFilterController.createInstance(this.id);if(WPGMZA.useLegacyGlobals&&wpgmzaLegacyGlobals.MYMAP[this.id])
wpgmzaLegacyGlobals.MYMAP[this.id].customFieldFilterController=this.customFieldFilterController;}
WPGMZA.ProMap.prototype.initUserLocationMarker=function(cachedPos){var self=this;if(this.settings.show_user_location!=1||parseInt(WPGMZA.is_admin)==1)
return;var icon=this.settings.upload_default_ul_marker;var options={id:WPGMZA.guid(),animation:WPGMZA.Marker.ANIMATION_DROP,user_location:true};if(icon&&icon.length)
options.icon=icon;if(this.settings.upload_default_ul_marker_retina){options.retina=true;}
var marker=WPGMZA.Marker.createInstance(options);marker.isFilterable=false;marker.setOptions({zIndex:999999});marker._icon.retina=marker.retina;if(cachedPos&&cachedPos.coords){marker.setPosition({lat:cachedPos.coords.latitude,lng:cachedPos.coords.longitude});if(!marker.map)
self.addMarker(marker);if(!self.userLocationMarker){self.userLocationMarker=marker;self.trigger("userlocationmarkerplaced");}}
WPGMZA.watchPosition(function(position){marker.setPosition({lat:position.coords.latitude,lng:position.coords.longitude});if(!marker.map)
self.addMarker(marker);if(!self.userLocationMarker)
{self.userLocationMarker=marker;self.trigger("userlocationmarkerplaced");}});}
WPGMZA.ProMap.prototype.initDirectionsBox=function()
{if(WPGMZA.is_admin==1)
return;if(!this.directionsEnabled)
return;this.directionsBox=WPGMZA.DirectionsBox.createInstance(this);}
WPGMZA.ProMap.prototype.addHeatmap=function(heatmap)
{if(!(heatmap instanceof WPGMZA.Heatmap))
throw new Error("Argument must be an instance of WPGMZA.Heatmap");heatmap.map=this;this.heatmaps.push(heatmap);this.dispatchEvent({type:"heatmapadded",heatmap:heatmap});}
WPGMZA.ProMap.prototype.getHeatmapByID=function(id)
{for(var i=0;i<this.heatmaps.length;i++)
if(this.heatmaps[i].id==id)
return this.heatmaps[i];return null;}
WPGMZA.ProMap.prototype.removeHeatmap=function(heatmap)
{if(!(heatmap instanceof WPGMZA.Heatmap))
throw new Error("Argument must be an instance of WPGMZA.Heatmap");if(heatmap.map!=this)
throw new Error("Wrong map error");heatmap.map=null;if(heatmap instanceof WPGMZA.GoogleHeatmap)
heatmap.googleHeatmap.setMap(null);this.heatmaps.splice(this.heatmaps.indexOf(heatmap),1);this.dispatchEvent({type:"heatmapremoved",heatmap:heatmap});}
WPGMZA.ProMap.prototype.removeHeatmapByID=function(id)
{var heatmap=this.getHeatmapByID(id);if(!heatmap)
return;this.removeHeatmap(heatmap);}
WPGMZA.ProMap.prototype.getInfoWindowStyle=function()
{if(!this.settings.other_settings)
return WPGMZA.ProInfoWindow.STYLE_NATIVE_GOOGLE;var local=this.settings.other_settings.wpgmza_iw_type;var global=WPGMZA.settings.wpgmza_iw_type;if(local=="-1"&&global=="-1")
return WPGMZA.ProInfoWindow.STYLE_NATIVE_GOOGLE;if(local=="-1")
return global;if(local)
return local;return WPGMZA.ProInfoWindow.STYLE_NATIVE_GOOGLE;}
WPGMZA.ProMap.prototype.getFilteringParameters=function()
{}
WPGMZA.ProMap.prototype.updateInfoWindowDistances=function()
{var location=this.showDistanceFromLocation;this.markers.forEach(function(marker){if(!marker.infoWindow)
return;marker.infoWindow.updateDistanceFromLocation();});}
WPGMZA.ProMap.prototype.hasVisibleMarkers=function()
{var markers=this.markers;for(var i=0;i<markers.length;i++)
{if(markers[i].isFilterable&&markers[i].getVisible())
return true;}
return false;}
WPGMZA.ProMap.prototype.pushElementIntoMapPanel=function(element,position)
{}
WPGMZA.ProMap.prototype.onClick=function(event)
{var self=this;if(this.settings.close_infowindow_on_map_click)
{if(event.target instanceof WPGMZA.Map)
{if(this.lastInteractedMarker!==undefined&&this.lastInteractedMarker.infoWindow){this.lastInteractedMarker.infoWindow.close();if($(this.lastInteractedMarker.infoWindow.element).hasClass('wpgmza_modern_infowindow')){$(this.lastInteractedMarker.infoWindow.element).remove();}}}}}
jQuery(document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange',function(){var isFullScreen=document.fullScreen||document.mozFullScreen||document.webkitIsFullScreen;var modernMarkerButton=jQuery('.wpgmza-modern-marker-open-button');var modernPopoutPanel=jQuery('.wpgmza-popout-panel');var modernStoreLocator=jQuery('.wpgmza-modern-store-locator');var fullScreenMap=undefined;if(modernMarkerButton.length){fullScreenMap=modernMarkerButton.parent('.wpgmza_map').children('div').first();}else if(modernPopoutPanel.length){fullScreenMap=modernPopoutPanel.parent('.wpgmza_map').children('div').first();}else{fullScreenMap=modernStoreLocator.parent('.wpgmza_map').children('div').first();}
if(isFullScreen&&typeof fullScreenMap!=="undefined"){fullScreenMap.append(modernMarkerButton,modernPopoutPanel,modernStoreLocator);}});});