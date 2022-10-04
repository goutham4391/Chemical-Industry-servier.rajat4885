jQuery(function($){WPGMZA.MarkerGallery=function(marker,context)
{var self=this;var guid=WPGMZA.guid();this.element=$("<div class='wpgmza-empty-gallery'/>");this.marker=marker;if(!marker.gallery)
return;if(marker.gallery.length<2)
{var first=marker.gallery[0];if(marker.gallery.length==0)
return;var preview=first.thumbnail?first.thumbnail:first.url;var img=context.getImageElementFromURL(preview);if(!WPGMZA.settings.disable_lightbox_images&&!this.marker.map.settings.disable_lightbox_images)
{img.attr("data-featherlight",first.url);if(context instanceof WPGMZA.ProInfoWindow)
{img.attr("id",guid);context.on("domready",function(event){$("#"+guid).on("click",function(event){self.onFeatherLightClick(event);});});}}
this.element=img;return;}
this.element=$("<div class='wpgmza-marker-gallery'><div id='"+guid+"' class='owl-carousel'></div></div>");this.carouselElement=this.element.find(".owl-carousel");marker.gallery.forEach(function(item){self.addPicture(item,context);});if(context instanceof WPGMZA.ProInfoWindow)
{var width=context.imageWidth;if(!width)
width=200;this.element.css({"width":width+"px","max-width":width+"px","overflow":"hidden"});this.carouselElement.css({"width":width+"px","max-width":width+"px","overflow":"hidden"});context.on("domready",function(event){$("#"+guid).owlCarousel(self.getOwlCarouselOptions());$("#"+guid).on("click","[data-featherlight]",function(event){self.onFeatherLightClick(event);});});}
else
{if(context instanceof WPGMZA.CarouselMarkerListing)
{setTimeout(function(){var width=$(context.element).find(".owl-item").innerWidth()-40;self.element.css({"width":width+"px","max-width":width+"px","overflow":"hidden"});self.carouselElement.css({"width":width+"px","max-width":width+"px","overflow":"hidden"});$(self.carouselElement).owlCarousel(self.getOwlCarouselOptions());},1000);}
else
setTimeout(function(){$(self.carouselElement).owlCarousel(self.getOwlCarouselOptions());},100);}}
WPGMZA.MarkerGallery.prototype.getOwlCarouselOptions=function()
{return{navigation:true,pagination:false,dots:false,slideSpeed:3000,paginationSpeed:400,singleItem:true,loop:true,items:1,autoplay:true,autoplayTimeout:4000};}
WPGMZA.MarkerGallery.prototype.addPicture=function(item,context)
{var container=$("<div/>"),img;if(!item.thumbnail)
item.thumbnail=item.url;if(context instanceof WPGMZA.ProInfoWindow)
{img=context.getImageElementFromURL(item.thumbnail);}
else
{img=$("<img/>");img.attr("src",item.thumbnail);}
img.css({"float":"none"});if(!WPGMZA.settings.disable_lightbox_images&&!this.marker.map.settings.disable_lightbox_images)
img.attr("data-featherlight",item.url);container.append(img);$(this.carouselElement).append(container);}
WPGMZA.MarkerGallery.prototype.onFeatherLightClick=function(event)
{var self=this;if(WPGMZA.isFullScreen())
{setTimeout(function(){$($(self.marker.map.element).find(".gm-style")[0]).append($(".featherlight"));},250);}}
$(document).on("fullscreenchange",function(){$(".featherlight").remove();});});