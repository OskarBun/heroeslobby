
define(
	["knockout",
     "./connection",
     "augment"], 
     
	function (ko, Connection) {
    	'use strict';
    	
    	function Appl(){
            this.title = ko.observable("Lobby");
			this.loading = ko.observable(false);
			this.user = ko.observable();
			this.connection = new Connection();
			
            this.connection.broadcast.subscribe(function(msg){
				if(msg.signal == "user"){
					if(msg.ws_version){
						if(this.ws_version == null){
							this.ws_version = msg.ws_version;
						} else if(this.ws_version != msg.ws_version){
							location.reload();
							return;
						}
					}
					msg.message.permissions = ko.observableArray(msg.message.permissions);
					this.config = msg.ws_config;
					this.user(msg.message);
				}
			},this);
            this.loading(true);
    	}
    	
    	
    	Appl.prototype.start = function(){
			this.connection.connect(function(){
				this.loading(false);
				ko.applyBindings(this);
			},this);
    	};
    	
    	return Appl;
	}
);