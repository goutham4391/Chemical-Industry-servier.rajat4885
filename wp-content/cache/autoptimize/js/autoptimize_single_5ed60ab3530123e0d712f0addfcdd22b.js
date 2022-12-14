jQuery(function($){WPGMZA.LatLngBounds=function(southWest,northEast)
{if(southWest instanceof WPGMZA.LatLngBounds)
{var other=southWest;this.south=other.south;this.north=other.north;this.west=other.west;this.east=other.east;}
else if(southWest&&northEast)
{this.south=southWest.lat;this.north=northEast.lat;this.west=southWest.lng;this.east=northEast.lng;}}
WPGMZA.LatLngBounds.fromGoogleLatLngBounds=function(googleLatLngBounds)
{if(!(googleLatLngBounds instanceof google.maps.LatLngBounds))
throw new Error("Argument must be an instance of google.maps.LatLngBounds");var result=new WPGMZA.LatLngBounds();var southWest=googleLatLngBounds.getSouthWest();var northEast=googleLatLngBounds.getNorthEast();result.north=northEast.lat();result.south=southWest.lat();result.west=southWest.lng();result.east=northEast.lng();return result;}
WPGMZA.LatLngBounds.fromGoogleLatLngBoundsLiteral=function(obj)
{var result=new WPGMZA.LatLngBounds();var southWest=obj.southwest;var northEast=obj.northeast;result.north=northEast.lat;result.south=southWest.lat;result.west=southWest.lng;result.east=northEast.lng;return result;}
WPGMZA.LatLngBounds.prototype.isInInitialState=function()
{return(this.north==undefined&&this.south==undefined&&this.west==undefined&&this.east==undefined);}
WPGMZA.LatLngBounds.prototype.extend=function(latLng)
{if(!(latLng instanceof WPGMZA.LatLng))
latLng=new WPGMZA.LatLng(latLng);if(this.isInInitialState())
{this.north=this.south=latLng.lat;this.west=this.east=latLng.lng;return;}
if(latLng.lat<this.north)
this.north=latLng.lat;if(latLng.lat>this.south)
this.south=latLng.lat;if(latLng.lng<this.west)
this.west=latLng.lng;if(latLng.lng>this.east)
this.east=latLng.lng;}
WPGMZA.LatLngBounds.prototype.extendByPixelMargin=function(map,x,arg)
{var y=x;if(!(map instanceof WPGMZA.Map))
throw new Error("First argument must be an instance of WPGMZA.Map");if(this.isInInitialState())
throw new Error("Cannot extend by pixels in initial state");if(arguments.length>=3)
y=arg;var southWest=new WPGMZA.LatLng(this.south,this.west);var northEast=new WPGMZA.LatLng(this.north,this.east);southWest=map.latLngToPixels(southWest);northEast=map.latLngToPixels(northEast);southWest.x-=x;southWest.y+=y;northEast.x+=x;northEast.y-=y;southWest=map.pixelsToLatLng(southWest.x,southWest.y);northEast=map.pixelsToLatLng(northEast.x,northEast.y);var temp=this.toString();this.north=northEast.lat;this.south=southWest.lat;this.west=southWest.lng;this.east=northEast.lng;}
WPGMZA.LatLngBounds.prototype.contains=function(latLng)
{if(!(latLng instanceof WPGMZA.LatLng))
throw new Error("Argument must be an instance of WPGMZA.LatLng");if(latLng.lat<Math.min(this.north,this.south))
return false;if(latLng.lat>Math.max(this.north,this.south))
return false;if(this.west<this.east)
return(latLng.lng>=this.west&&latLng.lng<=this.east);return(latLng.lng<=this.west||latLng.lng>=this.east);}
WPGMZA.LatLngBounds.prototype.toString=function()
{return this.north+"N "+this.south+"S "+this.west+"W "+this.east+"E";}
WPGMZA.LatLngBounds.prototype.toLiteral=function()
{return{north:this.north,south:this.south,west:this.west,east:this.east};}});