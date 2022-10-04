jQuery(function($){var core={MARKER_PULL_DATABASE:"0",MARKER_PULL_XML:"1",PAGE_MAP_LIST:"map-list",PAGE_MAP_EDIT:"map-edit",PAGE_SETTINGS:"map-settings",PAGE_SUPPORT:"map-support",PAGE_CATEGORIES:"categories",PAGE_ADVANCED:"advanced",PAGE_CUSTOM_FIELDS:"custom-fields",maps:[],events:null,settings:null,restAPI:null,localized_strings:null,loadingHTML:'<div class="wpgmza-preloader"><div class="wpgmza-loader">...</div></div>',preloaderHTML:"<div class='wpgmza-preloader'><div></div><div></div><div></div><div></div></div>",getCurrentPage:function(){switch(WPGMZA.getQueryParamValue("page"))
{case"wp-google-maps-menu":if(window.location.href.match(/action=edit/)&&window.location.href.match(/map_id=\d+/))
return WPGMZA.PAGE_MAP_EDIT;return WPGMZA.PAGE_MAP_LIST;break;case'wp-google-maps-menu-settings':return WPGMZA.PAGE_SETTINGS;break;case'wp-google-maps-menu-support':return WPGMZA.PAGE_SUPPORT;break;case'wp-google-maps-menu-categories':return WPGMZA.PAGE_CATEGORIES;break;case'wp-google-maps-menu-advanced':return WPGMZA.PAGE_ADVANCED;break;case'wp-google-maps-menu-custom-fields':return WPGMZA.PAGE_CUSTOM_FIELDS;break;default:return null;break;}},getScrollAnimationOffset:function(){return(WPGMZA.settings.scroll_animation_offset||0)+($("#wpadminbar").height()||0);},getScrollAnimationDuration:function(){if(WPGMZA.settings.scroll_animation_milliseconds)
return WPGMZA.settings.scroll_animation_milliseconds;else
return 500;},animateScroll:function(element,milliseconds){var offset=WPGMZA.getScrollAnimationOffset();if(!milliseconds)
milliseconds=WPGMZA.getScrollAnimationDuration();$("html, body").animate({scrollTop:$(element).offset().top-offset},milliseconds);},extend:function(child,parent){var constructor=child;child.prototype=Object.create(parent.prototype);child.prototype.constructor=constructor;},guid:function(){var d=new Date().getTime();if(typeof performance!=='undefined'&&typeof performance.now==='function'){d+=performance.now();}
return'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=(d+Math.random()*16)%16|0;d=Math.floor(d/16);return(c==='x'?r:(r&0x3|0x8)).toString(16);});},hexOpacityToRGBA:function(colour,opacity)
{var hex=parseInt(colour.replace(/^#/,""),16);return[(hex&0xFF0000)>>16,(hex&0xFF00)>>8,hex&0xFF,parseFloat(opacity)];},hexOpacityToString:function(colour,opacity)
{var arr=WPGMZA.hexOpacityToRGBA(colour,opacity);return"rgba("+arr[0]+", "+arr[1]+", "+arr[2]+", "+arr[3]+")";},hexToRgba:function(hex){var c;if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){c=hex.substring(1).split('');if(c.length==3){c=[c[0],c[0],c[1],c[1],c[2],c[2]];}
c='0x'+c.join('');return{r:(c>>16)&255,g:(c>>8)&255,b:c&255,a:1};}
return 0;},rgbaToString:function(rgba){return"rgba("+rgba.r+", "+rgba.g+", "+rgba.b+", "+rgba.a+")";},latLngRegexp:/^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/,isLatLngString:function(str)
{if(typeof str!="string")
return null;if(str.match(/^\(.+\)$/))
str=str.replace(/^\(|\)$/,"");var m=str.match(WPGMZA.latLngRegexp);if(!m)
return null;return new WPGMZA.LatLng({lat:parseFloat(m[1]),lng:parseFloat(m[3])});},stringToLatLng:function(str)
{var result=WPGMZA.isLatLngString(str);if(!result)
throw new Error("Not a valid latLng");return result;},isHexColorString:function(str)
{if(typeof str!="string")
return false;return(str.match(/#[0-9A-F]{6}/i)?true:false);},imageDimensionsCache:{},getImageDimensions:function(src,callback)
{if(WPGMZA.imageDimensionsCache[src])
{callback(WPGMZA.imageDimensionsCache[src]);return;}
var img=document.createElement("img");img.onload=function(event){var result={width:img.width,height:img.height};WPGMZA.imageDimensionsCache[src]=result;callback(result);};img.src=src;},decodeEntities:function(input)
{return input.replace(/&(nbsp|amp|quot|lt|gt);/g,function(m,e){return m[e];}).replace(/&#(\d+);/gi,function(m,e){return String.fromCharCode(parseInt(e,10));});},isDeveloperMode:function()
{return this.settings.developer_mode||(window.Cookies&&window.Cookies.get("wpgmza-developer-mode"));},isProVersion:function()
{return(this._isProVersion=="1");},openMediaDialog:function(callback){var file_frame;if(file_frame){file_frame.uploader.uploader.param('post_id',set_to_post_id);file_frame.open();return;}
file_frame=wp.media.frames.file_frame=wp.media({title:'Select a image to upload',button:{text:'Use this image',},multiple:false});file_frame.on('select',function(){attachment=file_frame.state().get('selection').first().toJSON();callback(attachment.id,attachment.url);});file_frame.open();},getCurrentPosition:function(callback,error,watch)
{var trigger="userlocationfound";var nativeFunction="getCurrentPosition";if(WPGMZA.userLocationDenied)
{if(error)
error({code:1,message:"Location unavailable"});return;}
if(watch)
{trigger="userlocationupdated";nativeFunction="watchPosition";}
if(!navigator.geolocation)
{console.warn("No geolocation available on this device");return;}
var options={enableHighAccuracy:true};if(!navigator.geolocation[nativeFunction])
{console.warn(nativeFunction+" is not available");return;}
navigator.geolocation[nativeFunction](function(position){if(callback)
callback(position);WPGMZA.events.trigger("userlocationfound");},function(err){options.enableHighAccuracy=false;navigator.geolocation[nativeFunction](function(position){if(callback)
callback(position);WPGMZA.events.trigger("userlocationfound");},function(err){console.warn(err.code,err.message);if(err.code==1)
WPGMZA.userLocationDenied=true;if(error)
error(err);},options);},options);},watchPosition:function(callback,error)
{return WPGMZA.getCurrentPosition(callback,error,true);},runCatchableTask:function(callback,friendlyErrorContainer){if(WPGMZA.isDeveloperMode())
callback();else
try{callback();}catch(e){var friendlyError=new WPGMZA.FriendlyError(e);$(friendlyErrorContainer).html("");$(friendlyErrorContainer).append(friendlyError.element);$(friendlyErrorContainer).show();}},capitalizeWords:function(string)
{return(string+"").replace(/^(.)|\s+(.)/g,function(m){return m.toUpperCase()});},pluralize:function(string)
{return WPGMZA.singularize(string)+"s";},singularize:function(string)
{return string.replace(/s$/,"");},assertInstanceOf:function(instance,instanceName){var engine,fullInstanceName,assert;var pro=WPGMZA.isProVersion()?"Pro":"";switch(WPGMZA.settings.engine)
{case"open-layers":engine="OL";break;default:engine="Google";break;}
if(WPGMZA[engine+pro+instanceName]&&engine+instanceName!="OLFeature")
fullInstanceName=engine+pro+instanceName;else if(WPGMZA[pro+instanceName])
fullInstanceName=pro+instanceName;else if(WPGMZA[engine+instanceName]&&WPGMZA[engine+instanceName].prototype)
fullInstanceName=engine+instanceName;else
fullInstanceName=instanceName;if(fullInstanceName=="OLFeature")
return;assert=instance instanceof WPGMZA[fullInstanceName];if(!assert)
throw new Error("Object must be an instance of "+fullInstanceName+" (did you call a constructor directly, rather than createInstance?)");},getMapByID:function(id){for(var i=0;i<WPGMZA.maps.length;i++){if(WPGMZA.maps[i].id==id)
return WPGMZA.maps[i];}
return null;},isGoogleAutocompleteSupported:function(){if(!window.google)
return false;if(!google.maps)
return false;if(!google.maps.places)
return false;if(!google.maps.places.Autocomplete)
return false;if(WPGMZA.CloudAPI&&WPGMZA.CloudAPI.isBeingUsed)
return false;return true;},googleAPIStatus:window.wpgmza_google_api_status,isSafari:function(){var ua=navigator.userAgent.toLowerCase();return(ua.match(/safari/i)&&!ua.match(/chrome/i));},isTouchDevice:function(){return("ontouchstart"in window);},isDeviceiOS:function(){return((/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream)||(!!navigator.platform&&/iPad|iPhone|iPod/.test(navigator.platform)));},isModernComponentStyleAllowed:function(){return(!WPGMZA.settings.user_interface_style||WPGMZA.settings.user_interface_style=="legacy"||WPGMZA.settings.user_interface_style=="modern");},isElementInView:function(element){var pageTop=$(window).scrollTop();var pageBottom=pageTop+$(window).height();var elementTop=$(element).offset().top;var elementBottom=elementTop+$(element).height();if(elementTop<pageTop&&elementBottom>pageBottom)
return true;if(elementTop>=pageTop&&elementTop<=pageBottom)
return true;if(elementBottom>=pageTop&&elementBottom<=pageBottom)
return true;return false;},isFullScreen:function(){return wpgmzaisFullScreen;},getQueryParamValue:function(name){var regex=new RegExp(name+"=([^&#]*)");var m;if(!(m=window.location.href.match(regex)))
return null;return decodeURIComponent(m[1]);},notification:function(text,time){switch(arguments.length)
{case 0:text="";time=4000;break;case 1:time=4000;break;}
var html='<div class="wpgmza-popup-notification">'+text+'</div>';jQuery('body').append(html);setTimeout(function(){jQuery('body').find('.wpgmza-popup-notification').remove();},time);},initMaps:function(){$(document.body).find(".wpgmza_map:not(.wpgmza-initialized)").each(function(index,el){if(el.wpgmzaMap){console.warn("Element missing class wpgmza-initialized but does have wpgmzaMap property. No new instance will be created");return;}
try{el.wpgmzaMap=WPGMZA.Map.createInstance(el);}catch(ex){console.warn('Map initalization: '+ex);}});WPGMZA.Map.nextInitTimeoutID=setTimeout(WPGMZA.initMaps,3000);},onScroll:function(){$(".wpgmza_map").each(function(index,el){var isInView=WPGMZA.isElementInView(el);if(!el.wpgmzaScrollIntoViewTriggerFlag){if(isInView){$(el).trigger("mapscrolledintoview.wpgmza");el.wpgmzaScrollIntoViewTriggerFlag=true;}}else if(!isInView){el.wpgmzaScrollIntoViewTriggerFlag=false;}});}};var wpgmzaisFullScreen=false;for(var key in[])
{console.warn("It appears that the built in JavaScript Array has been extended, this can create issues with for ... in loops, which may cause failure.");break;}
if(window.WPGMZA)
window.WPGMZA=$.extend(window.WPGMZA,core);else
window.WPGMZA=core;if(window.uc&&window.uc.reloadOnOptIn){window.uc.reloadOnOptIn('S1pcEj_jZX');window.uc.reloadOnOptOut('S1pcEj_jZX');}
for(var key in WPGMZA_localized_data){var value=WPGMZA_localized_data[key];WPGMZA[key]=value;}
WPGMZA.settings.useLegacyGlobals=true;$(document).on("fullscreenchange",function(){wpgmzaisFullScreen=document.fullscreenElement?true:false;});$('body').on('click',"#wpgmzaCloseChat",function(e){e.preventDefault();$.ajax(WPGMZA.ajaxurl,{method:'POST',data:{action:'wpgmza_hide_chat',nonce:WPGMZA_localized_data.ajaxnonce}});$('.wpgmza-chat-help').remove();});$(window).on("scroll",WPGMZA.onScroll);$(document.body).on("click","button.wpgmza-api-consent",function(event){Cookies.set("wpgmza-api-consent-given",true);window.location.reload();});$(document.body).on("keydown",function(event){if(event.altKey)
WPGMZA.altKeyDown=true;});$(document.body).on("keyup",function(event){if(!event.altKey)
WPGMZA.altKeyDown=false;});$(document.body).on('preinit.wpgmza',function(){$(window).trigger("ready.wpgmza");if($("script[src*='wp-google-maps.combined.js'], script[src*='wp-google-maps-pro.combined.js']").length){console.warn("Minified script is out of date, using combined script instead.");}
var elements=$("script[src]").filter(function(){return this.src.match(/(^|\/)jquery\.(min\.)?js(\?|$)/i);});if(elements.length>1){console.warn("Multiple jQuery versions detected: ",elements);}
var test=[];for(var key in test){console.warn("The Array object has been extended incorrectly by your theme or another plugin. This can cause issues with functionality.");break;}
if(window.location.protocol!='https:'){var warning='<div class="notice notice-warning"><p>'+WPGMZA.localized_strings.unsecure_geolocation+"</p></div>";$(".wpgmza-geolocation-setting").first().after($(warning));}
if(WPGMZA.googleAPIStatus&&WPGMZA.googleAPIStatus.code=="USER_CONSENT_NOT_GIVEN"){if(jQuery('.wpgmza-gdpr-compliance').length<=0){$("button.wpgmza-api-consent").on("click",function(event){Cookies.set("wpgmza-api-consent-given",true);window.location.reload();});}
return;}});(function($){$(function(){WPGMZA.restAPI=WPGMZA.RestAPI.createInstance();if(WPGMZA.CloudAPI){WPGMZA.cloudAPI=WPGMZA.CloudAPI.createInstance();}
$(document.body).trigger('preinit.wpgmza');WPGMZA.initMaps();WPGMZA.onScroll();});})($);});