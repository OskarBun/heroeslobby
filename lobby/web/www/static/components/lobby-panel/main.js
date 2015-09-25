define([
		"knockout",
		"text!./main-tmpl.html"
	],
	function(ko, main_tmpl){

		function Panel(params){
			this.appl = params.appl;
      this.map = params.lobby.battleground;
      this.red_users = params.lobby.teams()[0].members;
      this.blue_users = params.lobby.teams()[1].members;
      this.region_icon = "/static/images/"+params.lobby.region()+".svg";
		}

		Panel.prototype.init = function() {

		};

		Panel.prototype.dispose = function() {

		};

		return {
			template: main_tmpl,
			viewModel: Panel
		};
	}
);
