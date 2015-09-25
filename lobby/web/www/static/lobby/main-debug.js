require.config({
    urlArgs: "v=" +  (new Date()).getTime(),
    baseUrl: "static",
    paths: {
    	"augment":		  		"bower_components/augment.js/augment",
        "jquery" :        		"bower_components/jquery/dist/jquery",
        "knockout":		  		"bower_components/knockout/dist/knockout.debug",  
        "knockout-mapping":     "bower_components/knockout-mapping/knockout.mapping",
        "knockout-validation":  "bower_components/knockout-validation/dist/knockout.validation",
        
        "bootstrap":        	"bower_components/bootstrap/dist/js/bootstrap",
        "bootstrap-notify":  	"bower_components/bootstrap-notify/js/bootstrap-notify",

        "domready": 	  		"bower_components/requirejs-domready/domReady",
        "text":           		"bower_components/text/text",

        "signals":              "bower_components/js-signals/dist/signals",
        "hasher":               "bower_components/hasher/dist/js/hasher",
        "crossroads":           "bower_components/crossroads/dist/crossroads",

        "x-editable":           "bower_components/x-editable/dist/bootstrap3-editable/js/bootstrap-editable",
        "ko-x-editable":        "bower_components/knockout.x-editable/knockout.x-editable"
    },
    shim: {
        "bootstrap": {
            deps: ["jquery"]
        },
        "bootstrap-notify": {
            deps: ["bootstrap"]
        },
        "x-editable": {
            deps: ["jquery","bootstrap"]
        },
        "ko-x-editable": {
            deps: ["knockout","x-editable"]
        }
    },
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
