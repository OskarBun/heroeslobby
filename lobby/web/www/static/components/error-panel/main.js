define([
		"knockout",
		"text!./main-tmpl.html"
	],
	function(ko, main_tmpl){

		function Panel(params){
			this.appl = params.appl;
			this.error = params.error;
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