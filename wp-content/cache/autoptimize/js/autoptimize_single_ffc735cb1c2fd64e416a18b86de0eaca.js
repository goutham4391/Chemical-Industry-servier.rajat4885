jQuery(function($){WPGMZA.Polygon=function(row,enginePolygon)
{var self=this;WPGMZA.assertInstanceOf(this,"Polygon");this.paths=null;WPGMZA.Feature.apply(this,arguments);}
WPGMZA.Polygon.prototype=Object.create(WPGMZA.Feature.prototype);WPGMZA.Polygon.prototype.constructor=WPGMZA.Polygon;Object.defineProperty(WPGMZA.Polygon.prototype,"fillColor",{enumerable:true,"get":function()
{if(!this.fillcolor||!this.fillcolor.length)
return"#ff0000";return"#"+this.fillcolor.replace(/^#/,"");},"set":function(a){this.fillcolor=a;}});Object.defineProperty(WPGMZA.Polygon.prototype,"fillOpacity",{enumerable:true,"get":function()
{if(!this.opacity||!this.opacity.length)
return 0.6;return this.opacity;},"set":function(a){this.opacity=a;}});Object.defineProperty(WPGMZA.Polygon.prototype,"strokeColor",{enumerable:true,"get":function()
{if(!this.linecolor||!this.linecolor.length)
return"#ff0000";return"#"+this.linecolor.replace(/^#/,"");},"set":function(a){this.linecolor=a;}});Object.defineProperty(WPGMZA.Polygon.prototype,"strokeOpacity",{enumerable:true,"get":function()
{if(!this.lineopacity||!this.lineopacity.length)
return 0.6;return this.lineopacity;},"set":function(a){this.lineopacity=a;}});WPGMZA.Polygon.getConstructor=function()
{switch(WPGMZA.settings.engine)
{case"open-layers":if(WPGMZA.isProVersion())
return WPGMZA.OLProPolygon;return WPGMZA.OLPolygon;break;default:if(WPGMZA.isProVersion())
return WPGMZA.GoogleProPolygon;return WPGMZA.GooglePolygon;break;}}
WPGMZA.Polygon.createInstance=function(row,engineObject)
{var constructor=WPGMZA.Polygon.getConstructor();return new constructor(row,engineObject);}});