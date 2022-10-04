jQuery(function($){WPGMZA.MapSettings=function(element)
{var self=this;var str=element.getAttribute("data-settings");var json;try{json=JSON.parse(str);}catch(e){str=str.replace(/\\%/g,"%");str=str.replace(/\\\\"/g,'\\"');try{json=JSON.parse(str);}catch(e){json={};console.warn("Failed to parse map settings JSON");}}
WPGMZA.assertInstanceOf(this,"MapSettings");function addSettings(input){if(!input)
return;for(var key in input){if(key=="other_settings")
continue;var value=input[key];if(String(value).match(/^-?\d+$/))
value=parseInt(value);self[key]=value;}}
addSettings(WPGMZA.settings);addSettings(json);if(json&&json.other_settings)
addSettings(json.other_settings);}
WPGMZA.MapSettings.prototype.toOLViewOptions=function()
{var self=this;var options={center:ol.proj.fromLonLat([-119.4179,36.7783]),zoom:4};function empty(name)
{if(typeof self[name]=="object")
return false;return!self[name]||!self[name].length;}
if(typeof this.start_location=="string")
{var coords=this.start_location.replace(/^\(|\)$/g,"").split(",");if(WPGMZA.isLatLngString(this.start_location))
options.center=ol.proj.fromLonLat([parseFloat(coords[1]),parseFloat(coords[0])]);else
console.warn("Invalid start location");}
if(this.center)
{options.center=ol.proj.fromLonLat([parseFloat(this.center.lng),parseFloat(this.center.lat)]);}
if(!empty("map_start_lat")&&!empty("map_start_lng"))
{options.center=ol.proj.fromLonLat([parseFloat(this.map_start_lng),parseFloat(this.map_start_lat)]);}
if(this.zoom){options.zoom=parseInt(this.zoom);}
if(this.start_zoom){options.zoom=parseInt(this.start_zoom);}
if(this.map_start_zoom){options.zoom=parseInt(this.map_start_zoom);}
if(this.map_min_zoom&&this.map_max_zoom)
{options.minZoom=Math.min(this.map_min_zoom,this.map_max_zoom);options.maxZoom=Math.max(this.map_min_zoom,this.map_max_zoom);}
return options;}
WPGMZA.MapSettings.prototype.toGoogleMapsOptions=function()
{var self=this;var latLngCoords=(this.start_location&&this.start_location.length?this.start_location.split(","):[36.7783,-119.4179]);function empty(name)
{if(typeof self[name]=="object")
return false;return!self[name]||!self[name].length;}
function formatCoord(coord)
{if($.isNumeric(coord))
return coord;return parseFloat(String(coord).replace(/[\(\)\s]/,""));}
var latLng=new google.maps.LatLng(formatCoord(latLngCoords[0]),formatCoord(latLngCoords[1]));var zoom=(this.start_zoom?parseInt(this.start_zoom):4);if(!this.start_zoom&&this.zoom){zoom=parseInt(this.zoom);}
if(this.map_start_zoom){zoom=parseInt(this.map_start_zoom);}
var options={zoom:zoom,center:latLng};if(!empty("center"))
options.center=new google.maps.LatLng({lat:parseFloat(this.center.lat),lng:parseFloat(this.center.lng)});if(!empty("map_start_lat")&&!empty("map_start_lng"))
{options.center=new google.maps.LatLng({lat:parseFloat(this.map_start_lat),lng:parseFloat(this.map_start_lng)});}
if(this.map_min_zoom&&this.map_max_zoom)
{options.minZoom=Math.min(this.map_min_zoom,this.map_max_zoom);options.maxZoom=Math.max(this.map_min_zoom,this.map_max_zoom);}
function isSettingDisabled(value)
{if(value==="yes")
return true;return(value?true:false);}
options.zoomControl=!isSettingDisabled(this.wpgmza_settings_map_zoom);options.panControl=!isSettingDisabled(this.wpgmza_settings_map_pan);options.mapTypeControl=!isSettingDisabled(this.wpgmza_settings_map_type);options.streetViewControl=!isSettingDisabled(this.wpgmza_settings_map_streetview);options.fullscreenControl=!isSettingDisabled(this.wpgmza_settings_map_full_screen_control);options.draggable=!isSettingDisabled(this.wpgmza_settings_map_draggable);options.disableDoubleClickZoom=isSettingDisabled(this.wpgmza_settings_map_clickzoom);if(isSettingDisabled(this.wpgmza_settings_map_tilt_controls)){options.rotateControl=false;options.tilt=0;}
if(this.wpgmza_settings_map_scroll)
options.scrollwheel=false;if(this.wpgmza_force_greedy_gestures=="greedy"||this.wpgmza_force_greedy_gestures=="yes"||this.wpgmza_force_greedy_gestures==true)
{options.gestureHandling="greedy";if(!this.wpgmza_settings_map_scroll&&"scrollwheel"in options)
delete options.scrollwheel;}
else
options.gestureHandling="cooperative";switch(parseInt(this.type))
{case 2:options.mapTypeId=google.maps.MapTypeId.SATELLITE;break;case 3:options.mapTypeId=google.maps.MapTypeId.HYBRID;break;case 4:options.mapTypeId=google.maps.MapTypeId.TERRAIN;break;default:options.mapTypeId=google.maps.MapTypeId.ROADMAP;break;}
if(this.wpgmza_theme_data&&this.wpgmza_theme_data.length)
options.styles=WPGMZA.GoogleMap.parseThemeData(this.wpgmza_theme_data);return options;}});