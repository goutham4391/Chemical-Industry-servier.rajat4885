jQuery(function($){if(WPGMZA.settings.engine&&WPGMZA.settings.engine!="google-maps")
return;if(!window.google||!window.google.maps)
return;WPGMZA.GoogleHTMLOverlay=function(map)
{this.element=$("<div class='wpgmza-google-html-overlay'></div>");this.visible=true;this.position=new WPGMZA.LatLng();this.setMap(map.googleMap);this.wpgmzaMap=map;}
WPGMZA.GoogleHTMLOverlay.prototype=new google.maps.OverlayView();WPGMZA.GoogleHTMLOverlay.prototype.onAdd=function()
{var panes=this.getPanes();panes.overlayMouseTarget.appendChild(this.element[0]);}
WPGMZA.GoogleHTMLOverlay.prototype.onRemove=function()
{if(this.element&&$(this.element).parent().length)
{$(this.element).remove();this.element=null;}}
WPGMZA.GoogleHTMLOverlay.prototype.draw=function()
{this.updateElementPosition();}
WPGMZA.GoogleHTMLOverlay.prototype.updateElementPosition=function()
{var projection=this.getProjection();if(!projection)
return;var pixels=projection.fromLatLngToDivPixel(this.position.toGoogleLatLng());$(this.element).css({"left":pixels.x,"top":pixels.y});}});