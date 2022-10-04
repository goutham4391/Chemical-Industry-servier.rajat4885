jQuery(function($){var Parent=WPGMZA.Feature;WPGMZA.Rectangle=function(options,engineRectangle)
{var self=this;WPGMZA.assertInstanceOf(this,"Rectangle");this.name="";this.cornerA=new WPGMZA.LatLng();this.cornerB=new WPGMZA.LatLng();this.color="#ff0000";this.opacity=0.5;Parent.apply(this,arguments);}
WPGMZA.extend(WPGMZA.Rectangle,WPGMZA.Feature);Object.defineProperty(WPGMZA.Rectangle.prototype,"fillColor",{enumerable:true,"get":function()
{if(!this.color||!this.color.length)
return"#ff0000";return this.color;},"set":function(a){this.color=a;}});Object.defineProperty(WPGMZA.Rectangle.prototype,"fillOpacity",{enumerable:true,"get":function()
{if(!this.opacity&&this.opacity!=0)
return 0.5;return parseFloat(this.opacity);},"set":function(a){this.opacity=a;}});Object.defineProperty(WPGMZA.Rectangle.prototype,"strokeColor",{enumerable:true,"get":function()
{return"#000000";}});Object.defineProperty(WPGMZA.Rectangle.prototype,"strokeOpacity",{enumerable:true,"get":function()
{return 0;}});WPGMZA.Rectangle.createInstance=function(options,engineRectangle)
{var constructor;switch(WPGMZA.settings.engine)
{case"open-layers":constructor=WPGMZA.OLRectangle;break;default:constructor=WPGMZA.GoogleRectangle;break;}
return new constructor(options,engineRectangle);}});