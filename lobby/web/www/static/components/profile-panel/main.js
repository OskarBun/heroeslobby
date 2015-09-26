define([
		"knockout",
		"text!./main-tmpl.html"
	],
	function(ko, main_tmpl){

		function Panel(params){
			this.appl = params.appl;
			this.user = ko.observable();
			if(params.id == ko.unwrap(this.appl.user().id)){
				this.user(this.appl.user());
			}
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