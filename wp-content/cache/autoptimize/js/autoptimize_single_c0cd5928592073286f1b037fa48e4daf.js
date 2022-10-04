jQuery(function($){WPGMZA.LatLng=function(arg,lng)
{this._lat=0;this._lng=0;if(arguments.length==0)
return;if(arguments.length==1)
{if(typeof arg=="string")
{var m;if(!(m=arg.match(WPGMZA.LatLng.REGEXP)))
throw new Error("Invalid LatLng string");arg={lat:m[1],lng:m[3]};}
if(typeof arg!="object"||!("lat"in arg&&"lng"in arg))
throw new Error("Argument must be a LatLng literal");this.lat=arg.lat;this.lng=arg.lng;}
else
{this.lat=arg;this.lng=lng;}}
WPGMZA.LatLng.REGEXP=/^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/;WPGMZA.LatLng.isValid=function(obj)
{if(typeof obj!="object")
return false;if(!("lat"in obj&&"lng"in obj))
return false;return true;}
WPGMZA.LatLng.isLatLngString=function(str)
{if(typeof str!="string")
return false;return str.match(WPGMZA.LatLng.REGEXP)?true:false;}
Object.defineProperty(WPGMZA.LatLng.prototype,"lat",{get:function(){return this._lat;},set:function(val){if(!$.isNumeric(val))
throw new Error("Latitude must be numeric");this._lat=parseFloat(val);}});Object.defineProperty(WPGMZA.LatLng.prototype,"lng",{get:function(){return this._lng;},set:function(val){if(!$.isNumeric(val))
throw new Error("Longitude must be numeric");this._lng=parseFloat(val);}});WPGMZA.LatLng.fromString=function(string)
{if(!WPGMZA.LatLng.isLatLngString(string))
throw new Error("Not a valid latlng string");var m=string.match(WPGMZA.LatLng.REGEXP);return new WPGMZA.LatLng({lat:parseFloat(m[1]),lng:parseFloat(m[3])});}
WPGMZA.LatLng.prototype.toString=function()
{return this._lat+", "+this._lng;}
WPGMZA.LatLng.fromCurrentPosition=function(callback,options)
{if(!options)
options={};if(!callback)
return;WPGMZA.getCurrentPosition(function(position){var latLng=new WPGMZA.LatLng({lat:position.coords.latitude,lng:position.coords.longitude});if(options.geocodeAddress)
{var geocoder=WPGMZA.Geocoder.createInstance();geocoder.getAddressFromLatLng({latLng:latLng},function(results){if(results.length)
latLng.address=results[0];callback(latLng);});}
else
callback(latLng);});}
WPGMZA.LatLng.fromGoogleLatLng=function(googleLatLng)
{return new WPGMZA.LatLng(googleLatLng.lat(),googleLatLng.lng());}
WPGMZA.LatLng.toGoogleLatLngArray=function(arr)
{var result=[];arr.forEach(function(nativeLatLng){if(!(nativeLatLng instanceof WPGMZA.LatLng||("lat"in nativeLatLng&&"lng"in nativeLatLng)))
throw new Error("Unexpected input");result.push(new google.maps.LatLng({lat:parseFloat(nativeLatLng.lat),lng:parseFloat(nativeLatLng.lng)}));});return result;}
WPGMZA.LatLng.prototype.toGoogleLatLng=function()
{return new google.maps.LatLng({lat:this.lat,lng:this.lng});}
WPGMZA.LatLng.prototype.toLatLngLiteral=function()
{return{lat:this.lat,lng:this.lng};}
WPGMZA.LatLng.prototype.moveByDistance=function(kilometers,heading)
{var radius=6371;var delta=parseFloat(kilometers)/radius;var theta=parseFloat(heading)/180*Math.PI;var phi1=this.lat/180*Math.PI;var lambda1=this.lng/180*Math.PI;var sinPhi1=Math.sin(phi1),cosPhi1=Math.cos(phi1);var sinDelta=Math.sin(delta),cosDelta=Math.cos(delta);var sinTheta=Math.sin(theta),cosTheta=Math.cos(theta);var sinPhi2=sinPhi1*cosDelta+cosPhi1*sinDelta*cosTheta;var phi2=Math.asin(sinPhi2);var y=sinTheta*sinDelta*cosPhi1;var x=cosDelta-sinPhi1*sinPhi2;var lambda2=lambda1+Math.atan2(y,x);this.lat=phi2*180/Math.PI;this.lng=lambda2*180/Math.PI;}
WPGMZA.LatLng.prototype.getGreatCircleDistance=function(arg1,arg2)
{var lat1=this.lat;var lon1=this.lng;var other;if(arguments.length==1)
other=new WPGMZA.LatLng(arg1);else if(arguments.length==2)
other=new WPGMZA.LatLng(arg1,arg2);else
throw new Error("Invalid number of arguments");var lat2=other.lat;var lon2=other.lng;var R=6371;var phi1=lat1.toRadians();var phi2=lat2.toRadians();var deltaPhi=(lat2-lat1).toRadians();var deltaLambda=(lon2-lon1).toRadians();var a=Math.sin(deltaPhi/2)*Math.sin(deltaPhi/2)+
Math.cos(phi1)*Math.cos(phi2)*Math.sin(deltaLambda/2)*Math.sin(deltaLambda/2);var c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));var d=R*c;return d;}});