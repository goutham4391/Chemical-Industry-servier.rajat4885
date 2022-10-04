jQuery(function($){WPGMZA.ModernDirectionsBox=function(map){WPGMZA.DirectionsBox.apply(this,arguments);var self=this;var original=this.element;if(!original.length)
return;var container=$(map.element);this.map=map;this.element=$("<div class='wpgmza-popout-panel wpgmza-modern-directions-box'></div>");this.panel=new WPGMZA.PopoutPanel(this.element);this.element.append(original);container.append(this.element);$(this.element).find("h2").after($("\
   <div class='wpgmza-directions-buttons'>\
    <span class='wpgmza-close'><i class='fa fa-times' aria-hidden='true'></i></span>\
   </div>\
  "));$(this.element).find("td:first-child").remove();var row=$(this.element).find("select[name^='wpgmza_dir_type']").closest("tr");$(this.element).find(".wpgmaps_to_row").after(row);$(this.element).find("#wpgmza_options_box_"+map.id).addClass("wpgmza-directions-options");this.resultBox=new WPGMZA.ModernDirectionsResultBox(map,this);var behaviour=map.settings.directions_behaviour;if(behaviour=="intelligent")
{if(WPGMZA.isTouchDevice())
behaviour="external";else
behaviour="default";}
if(behaviour=="default")
{$(this.element).find(".wpgmaps_get_directions").on("click",function(event){if(self.from.length==0||self.to.length==0)
return;self.resultBox.open();});}
$(this.element).find(".wpgmza-close").on("click",function(event){self.panel.close();});$(this.element).on('click','.wpgmza-travel-mode-option',function(){var mode=jQuery(this).data('mode');jQuery('body').find('.wpgmza-travel-mode-option').removeClass('wpgmza-travel-option__selected');jQuery(this).addClass('wpgmza-travel-option__selected');jQuery('body').find('.wpgmza-travel-mode').val(mode);});};WPGMZA.extend(WPGMZA.ModernDirectionsBox,WPGMZA.DirectionsBox);Object.defineProperty(WPGMZA.ModernDirectionsBox.prototype,"from",{get:function(){return $(this.element).find("input.wpgmza-directions-from").val();},set:function(value){return $(this.element).find("input.wpgmza-directions-from").val(value);}});Object.defineProperty(WPGMZA.ModernDirectionsBox.prototype,"to",{get:function(){return $(this.element).find("input.wpgmza-directions-to").val();},set:function(value){return $(this.element).find("input.wpgmza-directions-to").val(value);}});WPGMZA.ModernDirectionsBox.prototype.open=function()
{this.panel.open();if(this.resultBox)
this.resultBox.close();$(this.element).children().show();};WPGMZA.ModernDirectionsBox.prototype.onNativeMapsApp=function()
{var url=this.getExternalURL();window.open(url,"_blank");}});