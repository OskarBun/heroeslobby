define([
		"knockout",
		"text!./main-tmpl.html",
		"text!./add-menu-tmpl.html"
	],
	function(ko, main_tmpl, add_menu_tmpl){

		ko.components.register("page-add-menu-component",{
			template: add_menu_tmpl
		});

		function Panel(params){
			this.appl = params.appl;
			this.lobbies = appl.store.get_lobbies();

			this.current_lobby = ko.observable();
			this.current_lobby.subscribe(function(value){
				if(value){
					this.appl.set_hash_silently("page/"+ko.unwrap(value.id));
				} else {
					this.appl.set_hash_silently("page");
				}
			},this);
			this.can_add = ko.pureComputed(function(){
				return this.appl.user();
			},this);
			if(params.id){
				this.appl.store.get_lobby(
					params.id,
					this.open_lobby.bind(this));
			}
		}

		Panel.prototype.init = function() {
			this.appl.menu_component({
				name:"page-add-menu-component",
				params:{
					add: this.add_lobby.bind(this),
					can_add: this.can_add
				}});
		};

		Panel.prototype.dispose = function() {
			this.appl.menu_component(null);
		};

		Panel.prototype.add_lobby = function() {
			this.appl.open_dialog("lobby-dialog",{appl:this.appl});
		};

		Panel.prototype.open_lobby = function(lobby){
			this.current_lobby(lobby);
		};

		return {
			template: main_tmpl,
			viewModel: Panel
		};
	}
);
