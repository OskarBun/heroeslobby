
define(
	["knockout",
     "./connection",
     "./model/main",
     "./register-routes",
     "signals",
     "./register-components",
     "bootstrap-notify",
     "ko-x-editable",
     "augment"], 
     
	function (ko, Connection, Store, Routes, signals) {
    	'use strict';
    	
    	function Appl(){
            this.title = ko.observable("Lobby");
			this.loading = ko.observable(false);
			this.user = ko.observable();
			this.error = ko.observable();
			this.component = ko.observable();
			this.connection = new Connection();
			this.routes = new Routes(this);
			this.store = new Store(this);

			this.title = ko.observable("Allercate");
			this.logo = ko.observable("static/images/ico/startup.png");


			/** The Search functionality. */
			this.search = new signals.Signal();
			this.search_term = ko.observable();
			this.search_focus = ko.observable(false);
			this.search_visible = ko.observable(false);
			
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
					this.config = msg.ws_config;
					this.user(msg.message);
				}
			},this);
            this.loading(true);
    	}
    	
    	
    	Appl.prototype.start = function(){
			this.connection.broadcast.subscribe(function(msg){
				if(msg.signal=="user"){
					msg.message.permissions=ko.observableArray(msg.message.permissions);
					this.user(msg.message);
				}
			},this);
			this.connection.connect(function(){
				this.routes.init();
				this.store.init();
				ko.applyBindings(this);
				this.loading = ko.observable(false);
				this.notify("loaded",{type:"success",position:".top-right"});
			},this);
    	};
	
		Appl.prototype.set_component = function(name, params){
			params = params || {};
			params.appl = this;
			this.component({
				name:name,
				params:params
			});
		};
	
		Appl.prototype.set_hash_silently = function(hash){
			this.routes.set_hash_silently(hash);
		};
		
		Appl.prototype.set_hash = function(hash){
			this.routes.set_hash(hash);
		};
		
		Appl.prototype.send = function(action, args, callback, target){
			this.connection.send({action:action,args:args},callback, target);
		};
		
		Appl.prototype.open_dialog = function(component,params){
			var dlog = $('#modal-dialog').empty();
			var div = $("<div>").appendTo(dlog);
			div.attr('data-bind',"component:{name:'"+component+"',params:$data}");
			dlog.modal("show");
			ko.applyBindings(params, div[0]);
			return dlog;
		};
		
		Appl.prototype.close_dialog = function(){
			$(".modal .close").click();
		};
		
		Appl.prototype.notify = function(message, options){
			options = options || {};
			$(options.position || '.bottom-left').notify({
				type: options.type || 'info',
				message: { text: message },
				fadeOut: { enabled: true, delay: options.duration || 2000 }
			}).show();
		};
		
		Appl.prototype.enable_search = function(handler, target, term){
			this.search_term(term || null);
			this.search.add(handler,target);
			this.search_visible(true);
			this.search_focus(true);
		};
		
		Appl.prototype.disable_search = function(handler, target){
			this.search_visible(false);
			this.search.remove(handler,target);
		};
    	
    	return Appl;
	}
);