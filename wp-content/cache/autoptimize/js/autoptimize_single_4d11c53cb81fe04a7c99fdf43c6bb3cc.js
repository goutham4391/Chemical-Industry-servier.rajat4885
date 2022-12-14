jQuery(function($){WPGMZA.GoogleRectangle=function(options,googleRectangle)
{var self=this;if(!options)
options={};WPGMZA.Rectangle.call(this,options,googleRectangle);if(googleRectangle)
{this.googleRectangle=googleRectangle;this.cornerA=options.cornerA=new WPGMZA.LatLng({lat:googleRectangle.getBounds().getNorthEast().lat(),lng:googleRectangle.getBounds().getSouthWest().lng(),});this.cornerB=options.cornerB=new WPGMZA.LatLng({lat:googleRectangle.getBounds().getSouthWest().lat(),lng:googleRectangle.getBounds().getNorthEast().lng()});}
else
{this.googleRectangle=new google.maps.Rectangle();this.googleRectangle.wpgmzaRectangle=this;}
this.googleFeature=this.googleRectangle;if(options)
this.setOptions(options);google.maps.event.addListener(this.googleRectangle,"click",function(){self.dispatchEvent({type:"click"});});}
WPGMZA.GoogleRectangle.prototype=Object.create(WPGMZA.Rectangle.prototype);WPGMZA.GoogleRectangle.prototype.constructor=WPGMZA.GoogleRectangle;WPGMZA.GoogleRectangle.prototype.getBounds=function()
{return WPGMZA.LatLngBounds.fromGoogleLatLngBounds(this.googleRectangle.getBounds());}
WPGMZA.GoogleRectangle.prototype.setVisible=function(visible)
{this.googleRectangle.setVisible(visible?true:false);}
WPGMZA.GoogleRectangle.prototype.setDraggable=function(value)
{this.googleRectangle.setDraggable(value?true:false);}
WPGMZA.GoogleRectangle.prototype.setEditable=function(value)
{var self=this;this.googleRectangle.setEditable(value?true:false);if(value)
{google.maps.event.addListener(this.googleRectangle,"bounds_changed",function(event){self.trigger("change");});}}
WPGMZA.GoogleRectangle.prototype.setOptions=function(options)
{WPGMZA.Rectangle.prototype.setOptions.apply(this,arguments);if(options.cornerA&&options.cornerB)
{this.cornerA=new WPGMZA.LatLng(options.cornerA);this.cornerB=new WPGMZA.LatLng(options.cornerB);}}
WPGMZA.GoogleRectangle.prototype.updateNativeFeature=function()
{var googleOptions=this.getScalarProperties();var north=parseFloat(this.cornerA.lat);var west=parseFloat(this.cornerA.lng);var south=parseFloat(this.cornerB.lat);var east=parseFloat(this.cornerB.lng);if(north&&west&&south&&east){googleOptions.bounds={north:north,west:west,south:south,east:east};}
this.googleRectangle.setOptions(googleOptions);}});