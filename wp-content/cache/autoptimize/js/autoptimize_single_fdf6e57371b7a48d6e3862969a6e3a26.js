jQuery(function($){WPGMZA.PopoutPanel=function(element)
{this.element=element;}
WPGMZA.PopoutPanel.prototype.open=function(){$(this.element).addClass("wpgmza-open");};WPGMZA.PopoutPanel.prototype.close=function(){$(this.element).removeClass("wpgmza-open");};});