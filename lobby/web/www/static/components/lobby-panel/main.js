define([
		"knockout",
		"text!./main-tmpl.html"
	],
	function(ko, main_tmpl){

		function Panel(params){
			this.appl = params.appl;
      this.map = params.map
      this.red_users = params.red_users
      this.blue_users = params.blue_users
      this.region_icon = "/static/images/"+params.region+".svg"
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
