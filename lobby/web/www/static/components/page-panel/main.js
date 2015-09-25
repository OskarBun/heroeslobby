define([
		"knockout",
		"text!./main-tmpl.html"
	],
	function(ko, main_tmpl){

		function Panel(params){
			this.appl = params.appl;
			this.status = this.appl.connection.status;
			this.id = params.id;
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