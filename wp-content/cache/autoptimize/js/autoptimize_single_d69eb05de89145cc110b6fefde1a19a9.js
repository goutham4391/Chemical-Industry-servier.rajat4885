jQuery(function($){var Parent=WPGMZA.Feature;WPGMZA.Circle=function(options,engineCircle)
{var self=this;WPGMZA.assertInstanceOf(this,"Circle");this.center=new WPGMZA.LatLng();this.radius=100;Parent.apply(this,arguments);}
WPGMZA.extend(WPGMZA.Circle,WPGMZA.Feature);Object.defineProperty(WPGMZA.Circle.prototype,"fillColor",{enumerable:true,"get":function()
{if(!this.color||!this.color.length)
return"#ff0000";return this.color;},"set":function(a){this.color=a;}});Object.defineProperty(WPGMZA.Circle.prototype,"fillOpacity",{enumerable:true,"get":function()
{if(!this.opacity&&this.opacity!=0)
return 0.5;return parseFloat(this.opacity);},"set":function(a){this.opacity=a;}});Object.defineProperty(WPGMZA.Circle.prototype,"strokeColor",{enumerable:true,"get":function()
{if(!this.lineColor){return"#000000";}
return this.lineColor;},"set":function(a){this.lineColor=a;}});Object.defineProperty(WPGMZA.Circle.prototype,"strokeOpacity",{enumerable:true,"get":function()
{if(!this.lineOpacity&&this.lineOpacity!=0)
return 0;return parseFloat(this.lineOpacity);},"set":function(a){this.lineOpacity=a;}});WPGMZA.Circle.createInstance=function(options,engineCircle)
{var constructor;switch(WPGMZA.settings.engine)
{case"open-layers":constructor=WPGMZA.OLCircle;break;default:constructor=WPGMZA.GoogleCircle;break;}
return new constructor(options,engineCircle);}
WPGMZA.Circle.prototype.getCenter=function()
{return this.center.clone();}
WPGMZA.Circle.prototype.setCenter=function(latLng)
{this.center.lat=latLng.lat;this.center.lng=latLng.lng;}
WPGMZA.Circle.prototype.getRadius=function()
{return this.radius;}
WPGMZA.Circle.prototype.setRadius=function(radius)
{this.radius=radius;}
WPGMZA.Circle.prototype.getMap=function()
{return this.map;}
WPGMZA.Circle.prototype.setMap=function(map)
{if(this.map)
this.map.removeCircle(this);if(map)
map.addCircle(this);}});