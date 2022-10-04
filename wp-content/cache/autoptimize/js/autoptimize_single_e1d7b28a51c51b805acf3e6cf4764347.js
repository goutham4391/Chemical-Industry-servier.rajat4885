jQuery(function($){WPGMZA.Marker=function(row)
{var self=this;this._offset={x:0,y:0};WPGMZA.assertInstanceOf(this,"Marker");this.lat="36.778261";this.lng="-119.4179323999";this.address="California";this.title=null;this.description="";this.link="";this.icon="";this.approved=1;this.pic=null;this.isFilterable=true;this.disableInfoWindow=false;WPGMZA.Feature.apply(this,arguments);if(row&&row.heatmap)
return;if(row)
this.on("init",function(event){if(row.position)
this.setPosition(row.position);if(row.map)
row.map.addMarker(this);});this.addEventListener("added",function(event){self.onAdded(event);});this.handleLegacyGlobals(row);}
WPGMZA.Marker.prototype=Object.create(WPGMZA.Feature.prototype);WPGMZA.Marker.prototype.constructor=WPGMZA.Marker;WPGMZA.Marker.getConstructor=function()
{switch(WPGMZA.settings.engine)
{case"open-layers":if(WPGMZA.isProVersion())
return WPGMZA.OLProMarker;return WPGMZA.OLMarker;break;default:if(WPGMZA.isProVersion())
return WPGMZA.GoogleProMarker;return WPGMZA.GoogleMarker;break;}}
WPGMZA.Marker.createInstance=function(row)
{var constructor=WPGMZA.Marker.getConstructor();return new constructor(row);}
WPGMZA.Marker.ANIMATION_NONE="0";WPGMZA.Marker.ANIMATION_BOUNCE="1";WPGMZA.Marker.ANIMATION_DROP="2";Object.defineProperty(WPGMZA.Marker.prototype,"offsetX",{get:function()
{return this._offset.x;},set:function(value)
{this._offset.x=value;this.updateOffset();}});Object.defineProperty(WPGMZA.Marker.prototype,"offsetY",{get:function()
{return this._offset.y;},set:function(value)
{this._offset.y=value;this.updateOffset();}});WPGMZA.Marker.prototype.onAdded=function(event)
{var self=this;this.addEventListener("click",function(event){self.onClick(event);});this.addEventListener("mouseover",function(event){self.onMouseOver(event);});this.addEventListener("select",function(event){self.onSelect(event);});if(this.map.settings.marker==this.id){self.trigger("select");}
if(this.infoopen=="1"){this.openInfoWindow(true);}}
WPGMZA.Marker.prototype.handleLegacyGlobals=function(row)
{if(!(WPGMZA.settings.useLegacyGlobals&&this.map_id&&this.id))
return;var m;if(WPGMZA.pro_version&&(m=WPGMZA.pro_version.match(/\d+/)))
{if(m[0]<=7)
return;}
if(!WPGMZA.legacyGlobals.marker_array[this.map_id])
WPGMZA.legacyGlobals.marker_array[this.map_id]=[];WPGMZA.legacyGlobals.marker_array[this.map_id][this.id]=this;if(!WPGMZA.legacyGlobals.wpgmaps_localize_marker_data[this.map_id])
WPGMZA.legacyGlobals.wpgmaps_localize_marker_data[this.map_id]=[];var cloned=$.extend({marker_id:this.id},row);WPGMZA.legacyGlobals.wpgmaps_localize_marker_data[this.map_id][this.id]=cloned;}
WPGMZA.Marker.prototype.initInfoWindow=function()
{if(this.infoWindow)
return;this.infoWindow=WPGMZA.InfoWindow.createInstance();}
WPGMZA.Marker.prototype.openInfoWindow=function(autoOpen){if(!this.map){console.warn("Cannot open infowindow for marker with no map");return;}
if(!autoOpen){if(this.map.lastInteractedMarker)
this.map.lastInteractedMarker.infoWindow.close();this.map.lastInteractedMarker=this;}
this.initInfoWindow();this.infoWindow.open(this.map,this);}
WPGMZA.Marker.prototype.onClick=function(event)
{}
WPGMZA.Marker.prototype.onSelect=function(event)
{this.openInfoWindow();}
WPGMZA.Marker.prototype.onMouseOver=function(event)
{if(WPGMZA.settings.wpgmza_settings_map_open_marker_by==WPGMZA.InfoWindow.OPEN_BY_HOVER)
this.openInfoWindow();}
WPGMZA.Marker.prototype.getIcon=function()
{function stripProtocol(url)
{if(typeof url!="string")
return url;return url.replace(/^http(s?):/,"");}
if(WPGMZA.defaultMarkerIcon)
return stripProtocol(WPGMZA.defaultMarkerIcon);return stripProtocol(WPGMZA.settings.default_marker_icon);}
WPGMZA.Marker.prototype.getPosition=function()
{return new WPGMZA.LatLng({lat:parseFloat(this.lat),lng:parseFloat(this.lng)});}
WPGMZA.Marker.prototype.setPosition=function(latLng)
{if(latLng instanceof WPGMZA.LatLng)
{this.lat=latLng.lat;this.lng=latLng.lng;}
else
{this.lat=parseFloat(latLng.lat);this.lng=parseFloat(latLng.lng);}}
WPGMZA.Marker.prototype.setOffset=function(x,y)
{this._offset.x=x;this._offset.y=y;this.updateOffset();}
WPGMZA.Marker.prototype.updateOffset=function()
{}
WPGMZA.Marker.prototype.getAnimation=function()
{return this.anim;}
WPGMZA.Marker.prototype.setAnimation=function(animation)
{}
WPGMZA.Marker.prototype.getVisible=function()
{}
WPGMZA.Marker.prototype.setVisible=function(visible)
{if(!visible&&this.infoWindow)
this.infoWindow.close();}
WPGMZA.Marker.prototype.getMap=function()
{return this.map;}
WPGMZA.Marker.prototype.setMap=function(map)
{if(!map)
{if(this.map)
this.map.removeMarker(this);}
else
map.addMarker(this);this.map=map;}
WPGMZA.Marker.prototype.getDraggable=function()
{}
WPGMZA.Marker.prototype.setDraggable=function(draggable)
{}
WPGMZA.Marker.prototype.setOptions=function(options)
{}
WPGMZA.Marker.prototype.setOpacity=function(opacity)
{}
WPGMZA.Marker.prototype.panIntoView=function()
{if(!this.map)
throw new Error("Marker hasn't been added to a map");this.map.setCenter(this.getPosition());}
WPGMZA.Marker.prototype.toJSON=function()
{var result=WPGMZA.Feature.prototype.toJSON.call(this);var position=this.getPosition();$.extend(result,{lat:position.lat,lng:position.lng,address:this.address,title:this.title,description:this.description,link:this.link,icon:this.icon,pic:this.pic,approved:this.approved});return result;}});