define([
		"knockout",
		"text!./main-tmpl.html"
	],
	function(ko, main_tmpl){

		function Pane(params){
			this.appl = params.appl;
			this.lobby = params.lobby;
		}

		Pane.prototype.init = function() {
			
		};

		Pane.prototype.dispose = function() {
			
		};

		Pane.prototype.close = function() {
			this.lobby(null);
		};

		return {
			template: main_tmpl,
			viewModel: Pane
		};
	}
);