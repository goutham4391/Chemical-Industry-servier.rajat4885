jQuery(function($){WPGMZA.ProMarker=function(row){var self=this;this._icon=WPGMZA.MarkerIcon.createInstance();if(row&&row.map_id)
var currentMap=WPGMZA.getMapByID(row.map_id);this.title="";this.description="";this.categories=[];this.approved=1;if(row&&row.retina){if(typeof row.icon==="object"&&row.icon.retina){this.retina=row.icon.retina;}else{if(row.retina===true){this.retina=row.retina;}else{this.retina=row.retina&&row.retina=='1'?1:0;}}}else{this.retina=0;}
if(currentMap&&currentMap.settings&&currentMap.settings.default_marker){try{var objtmp=JSON.parse(currentMap.settings.default_marker)
if(typeof objtmp=='object'){if(objtmp.retina){if(objtmp.retina==true){this.retina=true;}}}}catch(e){}}
if(row&&row.category&&row.category.length){var m=row.category.match(/\d+/g);if(m)
this.categories=m;}
WPGMZA.Marker.call(this,row);this.on("mouseover",function(event){self.onMouseOver(event);});}
WPGMZA.ProMarker.prototype=Object.create(WPGMZA.Marker.prototype);WPGMZA.ProMarker.prototype.constructor=WPGMZA.ProMarker;WPGMZA.ProMarker.STICKY_ZINDEX=999999;Object.defineProperty(WPGMZA.ProMarker.prototype,"isIntegrated",{get:function(){return/[^\d]/.test(this.id);}});Object.defineProperty(WPGMZA.ProMarker.prototype,"icon",{get:function(){if(this._icon.isDefault){return this.map.defaultMarkerIcon;}
return this._icon;},set:function(value){if(value instanceof WPGMZA.MarkerIcon){this._icon=value;if(this.map)
this.updateIcon();}
else if(typeof value=="object"||typeof value=="string"){if(typeof value=="object"){value.retina=this.retina&&this.retina===true?true:(this.retina&&this.retina=='1'?1:0);}
this._icon=WPGMZA.MarkerIcon.createInstance(value);if(this.map)
this.updateIcon();}
else
throw new Error("Value must be an instance of WPGMZA.MarkerIcon, an icon literal, or a string");}});WPGMZA.ProMarker.prototype.onAdded=function(event)
{var m;WPGMZA.Marker.prototype.onAdded.call(this,event);this.updateIcon();if(this.map.storeLocator&&this==this.map.storeLocator.marker)
return;if(this==this.map.userLocationMarker)
return;if(this.map.settings.wpgmza_store_locator_hide_before_search==1&&WPGMZA.is_admin!=1&&this.isFilterable)
{if(this.userCreated){return;}
this.isFiltered=true;this.setVisible(false);return;}
if(WPGMZA.getQueryParamValue("markerid")==this.id||this.map.shortcodeAttributes.marker==this.id){this.openInfoWindow();this.map.setCenter(this.getPosition());}
if("approved"in this&&this.approved==0)
this.setOpacity(0.6);if(this.sticky==1)
this.setOptions({zIndex:WPGMZA.ProMarker.STICKY_ZINDEX});}
WPGMZA.ProMarker.prototype.onClick=function(event)
{WPGMZA.Marker.prototype.onClick.apply(this,arguments);if(this.map.settings.wpgmza_zoom_on_marker_click&&this.map.settings.wpgmza_zoom_on_marker_click_slider){this.map.setZoom(this.map.settings.wpgmza_zoom_on_marker_click_slider);this.map.setCenter(this.getPosition());}
if(this.map.settings.click_open_link==1&&this.link&&this.link.length)
{if(WPGMZA.settings.wpgmza_settings_infowindow_links=="yes")
window.open(this.link);else
window.open(this.link,'_self');}}
WPGMZA.ProMarker.prototype.onMouseOver=function(event)
{if(WPGMZA.settings.wpgmza_settings_map_open_marker_by==WPGMZA.ProInfoWindow.OPEN_BY_HOVER)
this.openInfoWindow();}
WPGMZA.ProMarker.prototype.getIconFromCategory=function()
{if(!this.categories.length)
return;var self=this;var categoryIDs=this.categories.slice();categoryIDs.sort(function(a,b){var categoryA=self.map.getCategoryByID(a);var categoryB=self.map.getCategoryByID(b);if(!categoryA||!categoryB)
return null;return(categoryA.depth<categoryB.depth?-1:1);});for(var i=0;i<categoryIDs.length;i++)
{var category=this.map.getCategoryByID(categoryIDs[i]);if(!category)
continue;var icon=category.icon;if(icon&&icon.length)
return icon;}}
WPGMZA.ProMarker.prototype.setIcon=function(icon){this.icon=icon;}
WPGMZA.ProMarker.prototype.openInfoWindow=function(autoOpen){if(this.map.settings.wpgmza_listmarkers_by&&parseInt(this.map.settings.wpgmza_listmarkers_by)==6)
return false;WPGMZA.Marker.prototype.openInfoWindow.apply(this,arguments);if(this.disableInfoWindow)
return false;if((this.map&&this.map.userLocationMarker==this)||(typeof this.user_location!=='undefined'&&this.user_location))
this.infoWindow.setContent(WPGMZA.localized_strings.my_location);}});