jQuery(function($){$(document).ready(function(event){var parent=document.body.onclick;if(!parent)
return;document.body.onclick=function(event)
{if(event.target instanceof WPGMZA.Marker)
return;parent(event);}});});