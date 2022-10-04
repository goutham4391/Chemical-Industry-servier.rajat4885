jQuery(function($){WPGMZA.MapsEngineDialog=function(element)
{var self=this;this.element=element;if(window.wpgmzaUnbindSaveReminder)
window.wpgmzaUnbindSaveReminder();$(element).show();$(element).remodal().open();$(element).find("input:radio").on("change",function(event){$("#wpgmza-confirm-engine").prop("disabled",false);$("#wpgmza-confirm-engine").click();});$("#wpgmza-confirm-engine").on("click",function(event){self.onButtonClicked(event);});}
WPGMZA.MapsEngineDialog.prototype.onButtonClicked=function(event)
{$(event.target).prop("disabled",true);$.ajax(WPGMZA.ajaxurl,{method:"POST",data:{action:"wpgmza_maps_engine_dialog_set_engine",engine:$("[name='wpgmza_maps_engine']:checked").val(),nonce:$("#wpgmza-maps-engine-dialog").attr("data-ajax-nonce")},success:function(response,status,xhr){window.location.reload();}});}
$(document).ready(function(event){var element=$("#wpgmza-maps-engine-dialog");if(!element.length)
return;if(WPGMZA.settings.wpgmza_maps_engine_dialog_done)
return;if(WPGMZA.settings.wpgmza_google_maps_api_key&&WPGMZA.settings.wpgmza_google_maps_api_key.length)
return;WPGMZA.mapsEngineDialog=new WPGMZA.MapsEngineDialog(element);});});