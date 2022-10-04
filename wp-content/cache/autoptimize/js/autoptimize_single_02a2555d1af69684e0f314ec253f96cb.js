jQuery(function($){WPGMZA.InfoWindow=function(feature){var self=this;WPGMZA.EventDispatcher.call(this);WPGMZA.assertInstanceOf(this,"InfoWindow");this.on("infowindowopen",function(event){self.onOpen(event);});if(!feature)
return;this.feature=feature;this.state=WPGMZA.InfoWindow.STATE_CLOSED;if(feature.map)
{setTimeout(function(){self.onFeatureAdded(event);},100);}
else
feature.addEventListener("added",function(event){self.onFeatureAdded(event);});}
WPGMZA.InfoWindow.prototype=Object.create(WPGMZA.EventDispatcher.prototype);WPGMZA.InfoWindow.prototype.constructor=WPGMZA.InfoWindow;WPGMZA.InfoWindow.OPEN_BY_CLICK=1;WPGMZA.InfoWindow.OPEN_BY_HOVER=2;WPGMZA.InfoWindow.STATE_OPEN="open";WPGMZA.InfoWindow.STATE_CLOSED="closed";WPGMZA.InfoWindow.getConstructor=function()
{switch(WPGMZA.settings.engine)
{case"open-layers":if(WPGMZA.isProVersion())
return WPGMZA.OLProInfoWindow;return WPGMZA.OLInfoWindow;break;default:if(WPGMZA.isProVersion())
return WPGMZA.GoogleProInfoWindow;return WPGMZA.GoogleInfoWindow;break;}}
WPGMZA.InfoWindow.createInstance=function(feature)
{var constructor=this.getConstructor();return new constructor(feature);}
Object.defineProperty(WPGMZA.InfoWindow.prototype,"content",{"get":function()
{return this.getContent();},"set":function(value)
{this.contentHtml=value;}});WPGMZA.InfoWindow.prototype.addEditButton=function(){if(WPGMZA.currentPage=="map-edit"){if(this.feature instanceof WPGMZA.Marker){return' <a title="Edit this marker" style="width:15px;" class="wpgmza_edit_btn" data-edit-marker-id="'+this.feature.id+'"><i class="fa fa-edit"></i></a>';}}
return'';}
WPGMZA.InfoWindow.prototype.workOutDistanceBetweenTwoMarkers=function(location1,location2){if(!location1||!location2)
return;var distanceInKM=WPGMZA.Distance.between(location1,location2);var distanceToDisplay=distanceInKM;if(this.distanceUnits==WPGMZA.Distance.MILES)
distanceToDisplay/=WPGMZA.Distance.KILOMETERS_PER_MILE;var text=Math.round(distanceToDisplay,2);return text;}
WPGMZA.InfoWindow.prototype.getContent=function(callback){var html="";var extra_html="";if(this.feature instanceof WPGMZA.Marker){if(this.feature.map.settings.store_locator_show_distance&&this.feature.map.storeLocator&&(this.feature.map.storeLocator.state==WPGMZA.StoreLocator.STATE_APPLIED)){var currentLatLng=this.feature.getPosition();var distance=this.workOutDistanceBetweenTwoMarkers(this.feature.map.storeLocator.center,currentLatLng);extra_html+="<p>"+(this.feature.map.settings.store_locator_distance==WPGMZA.Distance.KILOMETERS?distance+WPGMZA.localized_strings.kilometers_away:distance+" "+WPGMZA.localized_strings.miles_away)+"</p>";}
html=this.feature.address+extra_html;}
if(this.contentHtml){html=this.contentHtml;}
if(callback)
callback(html);return html;}
WPGMZA.InfoWindow.prototype.open=function(map,feature){var self=this;this.feature=feature;if(WPGMZA.settings.disable_infowindows||WPGMZA.settings.wpgmza_settings_disable_infowindows=="1")
return false;if(this.feature.disableInfoWindow)
return false;this.state=WPGMZA.InfoWindow.STATE_OPEN;return true;}
WPGMZA.InfoWindow.prototype.close=function()
{if(this.state==WPGMZA.InfoWindow.STATE_CLOSED)
return;this.state=WPGMZA.InfoWindow.STATE_CLOSED;this.trigger("infowindowclose");}
WPGMZA.InfoWindow.prototype.setContent=function(options)
{}
WPGMZA.InfoWindow.prototype.setOptions=function(options)
{}
WPGMZA.InfoWindow.prototype.onFeatureAdded=function()
{if(this.feature.settings.infoopen==1)
this.open();}
WPGMZA.InfoWindow.prototype.onOpen=function()
{}});