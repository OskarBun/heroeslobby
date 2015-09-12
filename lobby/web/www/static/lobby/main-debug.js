require.config({
    urlArgs: "v=" +  (new Date()).getTime(),
    baseUrl: "static",
    paths: {
    	"augment":		  		"bower_components/augment.js/augment",
        "jquery" :        		"bower_components/jquery/dist/jquery",
        "knockout":		  		"bower_components/knockout/dist/knockout.debug",  

        "domready": 	  		"bower_components/requirejs-domready/domReady",
        "text":           		"bower_components/requirejs-text/text"
    },
    shim: {},
    packages:[]
});

require(
	["knockout",
     "lobby/appl",
     "domready!"], 
	function (ko, Appl) {
        "use strict";

        var appl = window.appl = new Appl();
        
        appl.start();
        
    	return appl;
	}
);
