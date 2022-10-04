jQuery(function($){WPGMZA.OLGeocoder=function()
{}
WPGMZA.OLGeocoder.prototype=Object.create(WPGMZA.Geocoder.prototype);WPGMZA.OLGeocoder.prototype.constructor=WPGMZA.OLGeocoder;WPGMZA.OLGeocoder.prototype.getResponseFromCache=function(query,callback)
{WPGMZA.restAPI.call("/geocode-cache",{data:{query:JSON.stringify(query)},success:function(response,xhr,status){response.lng=response.lon;callback(response);},useCompressedPathVariable:true});}
WPGMZA.OLGeocoder.prototype.getResponseFromNominatim=function(options,callback)
{var data={q:options.address,format:"json"};if(options.componentRestrictions&&options.componentRestrictions.country){data.countrycodes=options.componentRestrictions.country;}else if(options.country){data.countrycodes=options.country;}
$.ajax("https://nominatim.openstreetmap.org/search/",{data:data,success:function(response,xhr,status){callback(response);},error:function(response,xhr,status){callback(null,WPGMZA.Geocoder.FAIL)}});}
WPGMZA.OLGeocoder.prototype.cacheResponse=function(query,response)
{$.ajax(WPGMZA.ajaxurl,{data:{action:"wpgmza_store_nominatim_cache",query:JSON.stringify(query),response:JSON.stringify(response)},method:"POST"});}
WPGMZA.OLGeocoder.prototype.clearCache=function(callback)
{$.ajax(WPGMZA.ajaxurl,{data:{action:"wpgmza_clear_nominatim_cache"},method:"POST",success:function(response){callback(response);}});}
WPGMZA.OLGeocoder.prototype.getLatLngFromAddress=function(options,callback)
{return WPGMZA.OLGeocoder.prototype.geocode(options,callback);}
WPGMZA.OLGeocoder.prototype.getAddressFromLatLng=function(options,callback)
{return WPGMZA.OLGeocoder.prototype.geocode(options,callback);}
WPGMZA.OLGeocoder.prototype.geocode=function(options,callback)
{var self=this;if(!options)
throw new Error("Invalid options");if(WPGMZA.LatLng.REGEXP.test(options.address))
{var latLng=WPGMZA.LatLng.fromString(options.address);callback([{geometry:{location:latLng},latLng:latLng,lat:latLng.lat,lng:latLng.lng}],WPGMZA.Geocoder.SUCCESS);return;}
if(options.location)
options.latLng=new WPGMZA.LatLng(options.location);var finish,location;if(options.address)
{location=options.address;finish=function(response,status)
{for(var i=0;i<response.length;i++)
{response[i].geometry={location:new WPGMZA.LatLng({lat:parseFloat(response[i].lat),lng:parseFloat(response[i].lon)})};response[i].latLng={lat:parseFloat(response[i].lat),lng:parseFloat(response[i].lon)};response[i].bounds=new WPGMZA.LatLngBounds(new WPGMZA.LatLng({lat:response[i].boundingbox[1],lng:response[i].boundingbox[2]}),new WPGMZA.LatLng({lat:response[i].boundingbox[0],lng:response[i].boundingbox[3]}));response[i].lng=response[i].lon;}
callback(response,status);}}
else if(options.latLng)
{location=options.latLng.toString();finish=function(response,status)
{var address=response[0].display_name;callback([address],status);}}
else
throw new Error("You must supply either a latLng or address")
var query={location:location,options:options};this.getResponseFromCache(query,function(response){if(response.length)
{finish(response,WPGMZA.Geocoder.SUCCESS);return;}
self.getResponseFromNominatim($.extend(options,{address:location}),function(response,status){if(status==WPGMZA.Geocoder.FAIL)
{callback(null,WPGMZA.Geocoder.FAIL);return;}
if(response.length==0)
{callback([],WPGMZA.Geocoder.ZERO_RESULTS);return;}
finish(response,WPGMZA.Geocoder.SUCCESS);self.cacheResponse(query,response);});});}});