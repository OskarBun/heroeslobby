define(["crossroads",
        "hasher"],
        function(crossroads, hasher){
	
	function Routes(appl){
		this.appl = appl;

		crossroads.addRoute('',function(){
			this.set_component("page-panel");
		}.bind(this));

		crossroads.addRoute('/page/:id:',function(id){
			this.set_component("page-panel",{id:id});
		}.bind(this));

		crossroads.addRoute('/profile/{id}',function(id){
			this.set_component("profile-panel",{id:id});
		}.bind(this));
	}
	
	
	Routes.prototype.init = function(){
		//setup crossroads
		crossroads.routed.add(console.log, console); //log all routes
		
		crossroads.bypassed.add(function(route){
			this.appl.error("<strong>404</strong> - Page not found - " + route);
		},this);
		
		//setup hasher
		function parseHash(newHash, oldHash){
		  crossroads.parse(newHash);
		}
		hasher.initialized.add(parseHash); //parse initial hash
		hasher.changed.add(parseHash); //parse hash changes
		hasher.init(); //start listening for history change
	};
	
	
	Routes.prototype.set_component = function(name, params){
		this.appl.set_component(name, params);
	};
	
	Routes.prototype.set_hash_silently = function(hash){
		hasher.changed.active = false; //disable changed signal
		hasher.setHash(hash); //set hash without dispatching changed signal
		hasher.changed.active = true; //re-enable signal
	};
	
	Routes.prototype.set_hash = function(hash){
		hasher.setHash(hash); //set hash
	};
	
	return Routes;
});