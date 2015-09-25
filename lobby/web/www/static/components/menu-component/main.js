define([
		"knockout",
		"text!./main-tmpl.html"
	],
	function(ko, main_tmpl){

		function Panel(params){
			this.appl = params.appl;
			this.user = this.appl.user;
			this.status = this.appl.connection.status;
			this.loading = this.appl.loading;
			this.logo = this.appl.logo;
			
			this.search_term = this.appl.search_term;
			this.search_focus = this.appl.search_focus;
			this.search_visible = this.appl.search_visible;
			
			this.login_error = ko.observable();
			this.login_email = ko.observable();
			this.login_password = ko.observable();
			
			this.is_logged_in = ko.pureComputed(function(){
				return this.user() && this.status()=='Connected';
			},this);
			this.active_component = ko.pureComputed(function(){
				return this.appl.component() && this.appl.component().name;
			},this);
		}

		Panel.prototype.dispose = function() {
			
		};
		
		Panel.prototype.edit_user = function(){
			this.appl.set_hash("contact/" + this.appl.user().id);
		};
		
		Panel.prototype.change_password = function(){
			
		};
		
		Panel.prototype.connect = function(){
			this.appl.connection.connect();
		};
		
		Panel.prototype.search = function(){
			this.appl.search.dispatch(this.search_term());
		};
		
		Panel.prototype.login = function(){
			if(this.login_email() && this.login_password()){
				this.appl.connection.send({
					action:"login",
					email: this.login_email, 
					password: this.login_password
					}, function(response){
					if(response.error){
						this.login_error(response.error);
					}
					else{
						this.login_error(null);
						this.login_email(null);
						this.login_password(null);
						if(response.cookie){
							var expires = new Date();
							expires.setMonth( expires.getMonth( ) + 1 );
							document.cookie = response.cookie_name + '= "' + response.cookie + 
									'"; expires=' + expires.toGMTString() + 
									'; path=/';
						}
						this.appl.notify("You have signed in.",{position:'.top-right',type:'success'});
					}
				}.bind(this));
			}
		};

		return {
			template: main_tmpl,
			viewModel: Panel
		};
	}
);