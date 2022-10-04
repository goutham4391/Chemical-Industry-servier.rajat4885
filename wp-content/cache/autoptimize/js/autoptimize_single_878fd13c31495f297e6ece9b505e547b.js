jQuery(function($){WPGMZA.Polyline=function(options,googlePolyline)
{var self=this;WPGMZA.assertInstanceOf(this,"Polyline");WPGMZA.Feature.apply(this,arguments);}
WPGMZA.Polyline.prototype=Object.create(WPGMZA.Feature.prototype);WPGMZA.Polyline.prototype.constructor=WPGMZA.Polyline;Object.defineProperty(WPGMZA.Polyline.prototype,"strokeColor",{enumerable:true,"get":function()
{if(!this.linecolor||!this.linecolor.length)
return"#ff0000";return"#"+this.linecolor.replace(/^#/,"");},"set":function(a){this.linecolor=a;}});Object.defineProperty(WPGMZA.Polyline.prototype,"strokeOpacity",{enumerable:true,"get":function()
{if(!this.opacity||!this.opacity.length)
return 0.6;return this.opacity;},"set":function(a){this.opacity=a;}});Object.defineProperty(WPGMZA.Polyline.prototype,"strokeWeight",{enumerable:true,"get":function()
{if(!this.linethickness||!this.linethickness.length)
return 1;return parseInt(this.linethickness);},"set":function(a){this.linethickness=a;}});WPGMZA.Polyline.getConstructor=function()
{switch(WPGMZA.settings.engine)
{case"open-layers":return WPGMZA.OLPolyline;break;default:return WPGMZA.GooglePolyline;break;}}
WPGMZA.Polyline.createInstance=function(options,engineObject)
{var constructor=WPGMZA.Polyline.getConstructor();return new constructor(options,engineObject);}
WPGMZA.Polyline.prototype.getPoints=function()
{return this.toJSON().points;}
WPGMZA.Polyline.prototype.toJSON=function()
{var result=WPGMZA.Feature.prototype.toJSON.call(this);result.title=this.title;return result;}});