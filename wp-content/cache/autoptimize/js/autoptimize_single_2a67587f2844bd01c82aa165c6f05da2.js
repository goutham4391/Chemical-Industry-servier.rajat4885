jQuery(function($){WPGMZA.LatLng.fromJpeg=function(src,callback)
{var img=new Image();img.onload=function(){EXIF.getData(img,function(){var aLat=EXIF.getTag(img,"GPSLatitude");var aLng=EXIF.getTag(img,"GPSLongitude");if(!(aLat&&aLng))
{callback(null);return;}
var latRef=EXIF.getTag(img,"GPSLatitudeRef")||"N";var lngRef=EXIF.getTag(img,"GPSLongitudeRef")||"W";var fLat=(aLat[0]+aLat[1]/60+aLat[2]/3600)*(latRef=="N"?1:-1);var fLng=(aLng[0]+aLng[1]/60+aLng[2]/3600)*(lngRef=="W"?-1:1);callback(new WPGMZA.LatLng({lat:fLat,lng:fLng}));});}
img.src=src;}
WPGMZA.LatLng.EXIF_ADDRESS_GEOCODE_KM_THRESHOLD=0.5;$(document.body).on("click",".wpgmza-get-location-from-picture[data-source][data-destination]",function(event){var style,m,url;var source=$(this).attr("data-source");var dest=$(this).attr("data-destination");var lat=$(this).attr("data-destination-lat");var lng=$(this).attr("data-destination-lng");if(!$(source).length){alert(WPGMZA.localized_strings.no_picture_found);throw new Error("Source element not found");}
if(!$(dest).length){throw new Error("Destination element not found");}
if($(source).is("img")){url=$(source).attr("src");}else{style=$(source).css("background-image");if(!(m=style.match(/url\(["'](.+)["'"]\)/))){throw new Error("No background image found");}
url=m[1];}
if(!url||url.length==0)
alert(WPGMZA.localized_strings.no_picture_found);WPGMZA.LatLng.fromJpeg(url,function(jpegLatLng){if(!jpegLatLng)
{alert(WPGMZA.localized_strings.no_gps_coordinates);return;}
$(dest).val(jpegLatLng.toString());if(lat&&lng)
{$(lat).val(jpegLatLng.lat);$(lng).val(jpegLatLng.lng);}
if(WPGMZA.settings.useRawJpegCoordinates)
return;var geocoder=WPGMZA.Geocoder.createInstance();geocoder.getAddressFromLatLng({latLng:jpegLatLng},function(results,status){if(status!=WPGMZA.Geocoder.SUCCESS)
return;var address=results[0];geocoder.getLatLngFromAddress({address:address},function(results,status){if(status!=WPGMZA.Geocoder.SUCCESS)
return;var addressLatLng=new WPGMZA.LatLng(results[0].latLng);var kmOffset=WPGMZA.Distance.between(addressLatLng,jpegLatLng);if(kmOffset<=WPGMZA.LatLng.EXIF_ADDRESS_GEOCODE_KM_THRESHOLD)
$(dest).val(address);});});});});});