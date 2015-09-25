define([
		"knockout",
		"text!./main-tmpl.html"
	],
	function(ko, main_tmpl){

		function Panel(params){
			this.appl = params.appl;
			this.title = "Change Password";
			this.old = ko.observable();
			this.new_1 = ko.observable();
			this.new_2 = ko.observable();
			this.error = ko.observable();

			this.can_save = ko.pureComputed(function(){
				return this.old() && this.new_1() && 
						   this.new_1().length > 4 &&
						   (this.new_1()==this.new_2());
			},this);
		}

		Panel.prototype.init = function() {
			
		};

		Panel.prototype.dispose = function() {
			
		};

		Panel.prototype.save = function() {
			this.appl.send('change_password', { 
				old_password:this.old(), 
				new_password:this.new_1() 
			}, 
			function(response){
				if(response.error){
					dlog_model.error(response.error);
				} else {
					this.appl.close_dialog();
				}
			},this);
		};

		return {
			template: main_tmpl,
			viewModel: Panel
		};
	}
);