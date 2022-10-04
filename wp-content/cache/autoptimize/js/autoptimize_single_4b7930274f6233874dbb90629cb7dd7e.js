jQuery(function($){WPGMZA.RestAPI=function()
{WPGMZA.RestAPI.URL=WPGMZA.resturl;this.useAJAXFallback=false;}
WPGMZA.RestAPI.CONTEXT_REST="REST";WPGMZA.RestAPI.CONTEXT_AJAX="AJAX";WPGMZA.RestAPI.createInstance=function()
{return new WPGMZA.RestAPI();}
Object.defineProperty(WPGMZA.RestAPI.prototype,"isCompressedPathVariableSupported",{get:function()
{return WPGMZA.serverCanInflate&&"Uint8Array"in window&&"TextEncoder"in window;}});Object.defineProperty(WPGMZA.RestAPI.prototype,"isCompressedPathVariableAllowed",{get:function()
{if(!WPGMZA.pro_version||WPGMZA.Version.compare(WPGMZA.pro_version,"8.0.0")>=WPGMZA.Version.EQUAL_TO)
return!WPGMZA.settings.disable_compressed_path_variables;return WPGMZA.settings.enable_compressed_path_variables;}});Object.defineProperty(WPGMZA.RestAPI.prototype,"maxURLLength",{get:function()
{return 2083;}});WPGMZA.RestAPI.prototype.compressParams=function(params)
{var suffix="";if(params.markerIDs)
{var markerIDs=params.markerIDs.split(",");if(markerIDs.length>1)
{var encoder=new WPGMZA.EliasFano();var encoded=encoder.encode(markerIDs);var compressed=pako.deflate(encoded);var string=Array.prototype.map.call(compressed,function(ch){return String.fromCharCode(ch);}).join("");suffix="/"+btoa(string).replace(/\//g,"-").replace(/=+$/,"");params.midcbp=encoded.pointer;delete params.markerIDs;}}
var string=JSON.stringify(params);var encoder=new TextEncoder();var input=encoder.encode(string);var compressed=pako.deflate(input);var raw=Array.prototype.map.call(compressed,function(ch){return String.fromCharCode(ch);}).join("");var base64=btoa(raw);return base64.replace(/\//g,"-").replace(/=+$/,"")+suffix;}
function sendAJAXFallbackRequest(route,params)
{var params=$.extend({},params);if(!params.data)
params.data={};if("route"in params.data)
throw new Error("Cannot send route through this method");if("action"in params.data)
throw new Error("Cannot send action through this method");params.data.route=route;params.data.action="wpgmza_rest_api_request";WPGMZA.restAPI.addNonce(route,params,WPGMZA.RestAPI.CONTEXT_AJAX);return $.ajax(WPGMZA.ajaxurl,params);}
WPGMZA.RestAPI.prototype.getNonce=function(route)
{var matches=[];for(var pattern in WPGMZA.restnoncetable)
{var regex=new RegExp(pattern);if(route.match(regex))
matches.push({pattern:pattern,nonce:WPGMZA.restnoncetable[pattern],length:pattern.length});}
if(!matches.length)
throw new Error("No nonce found for route");matches.sort(function(a,b){return b.length-a.length;});return matches[0].nonce;}
WPGMZA.RestAPI.prototype.addNonce=function(route,params,context)
{var self=this;var setRESTNonce=function(xhr){if(context==WPGMZA.RestAPI.CONTEXT_REST&&self.shouldAddNonce(route)){xhr.setRequestHeader('X-WP-Nonce',WPGMZA.restnonce);}
if(params&&params.method&&!params.method.match(/^GET$/i)){xhr.setRequestHeader('X-WPGMZA-Action-Nonce',self.getNonce(route));}};if(!params.beforeSend){params.beforeSend=setRESTNonce;}else{var base=params.beforeSend;params.beforeSend=function(xhr){base(xhr);setRESTNonce(xhr);}}}
WPGMZA.RestAPI.prototype.shouldAddNonce=function(route){route=route.replace(/\//g,'');var isAdmin=false;if(WPGMZA.is_admin){if(parseInt(WPGMZA.is_admin)===1){isAdmin=true;}}
var skipNonceRoutes=['markers','features','marker-listing','datatables'];if(route&&skipNonceRoutes.includes(route)&&!isAdmin){return false;}
return true;}
WPGMZA.RestAPI.prototype.call=function(route,params)
{if(this.useAJAXFallback)
return sendAJAXFallbackRequest(route,params);var self=this;var attemptedCompressedPathVariable=false;var fallbackRoute=route;var fallbackParams=$.extend({},params);if(typeof route!="string"||(!route.match(/^\//)&&!route.match(/^http/)))
throw new Error("Invalid route");if(WPGMZA.RestAPI.URL.match(/\/$/))
route=route.replace(/^\//,"");if(!params)
params={};this.addNonce(route,params,WPGMZA.RestAPI.CONTEXT_REST);if(!params.error)
params.error=function(xhr,status,message){if(status=="abort")
return;switch(xhr.status)
{case 401:case 403:case 405:$.post(WPGMZA.ajaxurl,{action:"wpgmza_report_rest_api_blocked"},function(response){});console.warn("The REST API was blocked. This is usually due to security plugins blocking REST requests for non-authenticated users.");if(params.method==="DELETE"){console.warn("The REST API rejected a DELETE request, attempting again with POST fallback");params.method="POST";if(!params.data){params.data={};}
params.data.simulateDelete='yes';return WPGMZA.restAPI.call(route,params);}
this.useAJAXFallback=true;return sendAJAXFallbackRequest(fallbackRoute,fallbackParams);break;case 414:if(!attemptedCompressedPathVariable)
break;fallbackParams.method="POST";fallbackParams.useCompressedPathVariable=false;return WPGMZA.restAPI.call(fallbackRoute,fallbackParams);break;}
throw new Error(message);}
if(params.useCompressedPathVariable&&this.isCompressedPathVariableSupported&&this.isCompressedPathVariableAllowed)
{var compressedParams=$.extend({},params);var data=params.data;var base64=this.compressParams(data);if(WPGMZA.isServerIIS)
base64=base64.replace(/\+/g,"%20");var compressedRoute=route.replace(/\/$/,"")+"/base64"+base64;var fullCompressedRoute=WPGMZA.RestAPI.URL+compressedRoute;compressedParams.method="GET";delete compressedParams.data;if(params.cache===false)
compressedParams.data={skip_cache:1};if(compressedRoute.length<this.maxURLLength)
{attemptedCompressedPathVariable=true;route=compressedRoute;params=compressedParams;}
else
{if(!WPGMZA.RestAPI.compressedPathVariableURLLimitWarningDisplayed)
console.warn("Compressed path variable route would exceed URL length limit");WPGMZA.RestAPI.compressedPathVariableURLLimitWarningDisplayed=true;}}
var onSuccess=null;if(params.success){onSuccess=params.success;}
params.success=function(result,status,xhr){if(typeof result!=='object'){var rawResult=result;try{result=JSON.parse(result);}catch(parseExc){result=rawResult;}}
if(onSuccess&&typeof onSuccess==='function'){onSuccess(result,status,xhr);}};if(WPGMZA.RestAPI.URL.match(/\?/))
route=route.replace(/\?/,"&");return $.ajax(WPGMZA.RestAPI.URL+route,params);}
var nativeCallFunction=WPGMZA.RestAPI.call;WPGMZA.RestAPI.call=function()
{console.warn("WPGMZA.RestAPI.call was called statically, did you mean to call the function on WPGMZA.restAPI?");nativeCallFunction.apply(this,arguments);}
$(document.body).on("click","#wpgmza-rest-api-blocked button.notice-dismiss",function(event){WPGMZA.restAPI.call("/rest-api/",{method:"POST",data:{dismiss_blocked_notice:true}});});});