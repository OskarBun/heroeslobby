define([
		"knockout",
		"text!./main-tmpl.html"
	],
	function(ko, main_tmpl){

		function Panel(params){
			this.appl = params.appl;
			this.lobbies = appl.store.get_lobbies();
			// [
			// 	{
			// 		"map": "Garden of Terror",
			// 		"red_users": ko.observableArray(["Blah", "Blah", "Blah", "Blah", "Blah"]),
			// 		"blue_users": ko.observableArray(["Blah", "Blah", "Blah", "Blah", "Blah"]),
			// 		"region": "eu"
			// 	},
			// 	{
			// 		"map": "Tomb of the Spider Queen",
			// 		"red_users": ko.observableArray(["Blah", "Blah", "Blah", "Blah", "Blah"]),
			// 		"blue_users": ko.observableArray(["Blah", "Blah", "Blah", "Blah", "Blah"]),
			// 		"region": "na"
			// 	}
			// ]
		}

		Panel.prototype.init = function() {
		};

		Panel.prototype.dispose = function() {

		};

		Panel.prototype.add_lobby = function() {
			this.appl.open_dialog("lobby-dialog",{appl:this.appl});
		};

		return {
			template: main_tmpl,
			viewModel: Panel
		};
	}
);
