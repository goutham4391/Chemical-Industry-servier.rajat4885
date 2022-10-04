jQuery(function($){var earthRadiusMeters=6371;var piTimes360=Math.PI/360;function deg2rad(deg){return deg*(Math.PI/180)};WPGMZA.Distance={MILES:true,KILOMETERS:false,MILES_PER_KILOMETER:0.621371,KILOMETERS_PER_MILE:1.60934,uiToMeters:function(uiDistance)
{return parseFloat(uiDistance)/(WPGMZA.settings.distance_units==WPGMZA.Distance.MILES?WPGMZA.Distance.MILES_PER_KILOMETER:1)*1000;},uiToKilometers:function(uiDistance)
{return WPGMZA.Distance.uiToMeters(uiDistance)*0.001;},uiToMiles:function(uiDistance)
{return WPGMZA.Distance.uiToKilometers(uiDistance)*WPGMZA.Distance.MILES_PER_KILOMETER;},kilometersToUI:function(km)
{if(WPGMZA.settings.distance_units==WPGMZA.Distance.MILES)
return km*WPGMZA.Distance.MILES_PER_KILOMETER;return km;},between:function(a,b)
{if(!(a instanceof WPGMZA.LatLng)&&!("lat"in a&&"lng"in a))
throw new Error("First argument must be an instance of WPGMZA.LatLng or a literal");if(!(b instanceof WPGMZA.LatLng)&&!("lat"in b&&"lng"in b))
throw new Error("Second argument must be an instance of WPGMZA.LatLng or a literal");if(a===b)
return 0.0;var lat1=a.lat;var lon1=a.lng;var lat2=b.lat;var lon2=b.lng;var dLat=deg2rad(lat2-lat1);var dLon=deg2rad(lon2-lon1);var a=Math.sin(dLat/2)*Math.sin(dLat/2)+
Math.cos(deg2rad(lat1))*Math.cos(deg2rad(lat2))*Math.sin(dLon/2)*Math.sin(dLon/2);var c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));var d=earthRadiusMeters*c;return d;}};});