jQuery(function($){function isPositiveInteger(x){return/^\d+$/.test(x);}
function validateParts(parts){for(var i=0;i<parts.length;++i){if(!isPositiveInteger(parts[i])){return false;}}
return true;}
WPGMZA.Version=function()
{}
WPGMZA.Version.GREATER_THAN=1;WPGMZA.Version.EQUAL_TO=0;WPGMZA.Version.LESS_THAN=-1;WPGMZA.Version.compare=function(v1,v2)
{var v1parts=v1.match(/\d+/g);var v2parts=v2.match(/\d+/g);for(var i=0;i<v1parts.length;++i){if(v2parts.length===i){return 1;}
if(v1parts[i]===v2parts[i]){continue;}
if(v1parts[i]>v2parts[i]){return 1;}
return-1;}
if(v1parts.length!=v2parts.length){return-1;}
return 0;}});