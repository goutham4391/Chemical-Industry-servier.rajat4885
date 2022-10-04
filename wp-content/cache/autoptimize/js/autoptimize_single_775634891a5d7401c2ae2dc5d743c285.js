jQuery(function($){WPGMZA.GoogleAPIErrorHandler=function(){var self=this;if(WPGMZA.settings.engine!="google-maps")
return;if(!(WPGMZA.currentPage=="map-edit"||(WPGMZA.is_admin==0&&WPGMZA.userCanAdministrator==1)))
return;this.element=$(WPGMZA.html.googleMapsAPIErrorDialog);if(WPGMZA.is_admin==1)
this.element.find(".wpgmza-front-end-only").remove();this.errorMessageList=this.element.find(".wpgmza-google-api-error-list");this.templateListItem=this.element.find("li.template").remove();this.messagesAlreadyDisplayed={};var _error=console.error;console.error=function(message)
{self.onErrorMessage(message);_error.apply(this,arguments);}
if(WPGMZA.settings.engine=="google-maps"&&(!WPGMZA.settings.wpgmza_google_maps_api_key||!WPGMZA.settings.wpgmza_google_maps_api_key.length)&&WPGMZA.getCurrentPage()!=WPGMZA.PAGE_MAP_EDIT)
this.addErrorMessage(WPGMZA.localized_strings.no_google_maps_api_key,["https://www.wpgmaps.com/documentation/creating-a-google-maps-api-key/"]);}
WPGMZA.GoogleAPIErrorHandler.prototype.onErrorMessage=function(message)
{var m;var regexURL=/http(s)?:\/\/[^\s]+/gm;if(!message)
return;if((m=message.match(/You have exceeded your (daily )?request quota for this API/))||(m=message.match(/This API project is not authorized to use this API/))||(m=message.match(/^Geocoding Service: .+/)))
{var urls=message.match(regexURL);this.addErrorMessage(m[0],urls);}
else if(m=message.match(/^Google Maps.+error: (.+)\s+(http(s?):\/\/.+)/m))
{this.addErrorMessage(m[1].replace(/([A-Z])/g," $1"),[m[2]]);}}
WPGMZA.GoogleAPIErrorHandler.prototype.addErrorMessage=function(message,urls)
{var self=this;if(this.messagesAlreadyDisplayed[message])
return;var li=this.templateListItem.clone();$(li).find(".wpgmza-message").html(message);var buttonContainer=$(li).find(".wpgmza-documentation-buttons");var buttonTemplate=$(li).find(".wpgmza-documentation-buttons>a");buttonTemplate.remove();if(urls&&urls.length)
{for(var i=0;i<urls.length;i++)
{var url=urls[i];var button=buttonTemplate.clone();var icon="fa-external-link";var text=WPGMZA.localized_strings.documentation;button.attr("href",urls[i]);$(button).find("i").addClass(icon);$(button).append(text);}
buttonContainer.append(button);}
$(this.errorMessageList).append(li);$("#wpgmza_map, .wpgmza_map").each(function(index,el){var container=$(el).find(".wpgmza-google-maps-api-error-overlay");if(container.length==0)
{container=$("<div class='wpgmza-google-maps-api-error-overlay'></div>");container.html(self.element.html());}
setTimeout(function(){$(el).append(container);},1000);});$(".gm-err-container").parent().css({"z-index":1});this.messagesAlreadyDisplayed[message]=true;}
WPGMZA.googleAPIErrorHandler=new WPGMZA.GoogleAPIErrorHandler();});