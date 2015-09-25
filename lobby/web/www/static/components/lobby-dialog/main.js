define([
		"knockout",
		"text!./main-tmpl.html",
		"knockout-validation"
	],
	function(ko, main_tmpl){

		function Panel(params){
			this.appl = params.appl;
			this.error = ko.observable();

			this.name = ko.observable().extend({ required: true });
			this.regions = ["eu","na","asia"];
			this.region = ko.observable(this.regions[0]);

			this.battlegrounds = this.appl.store.get_battlegrounds();
			this.battleground = ko.observable().extend({ required: true });

			this.team1 = ko.observable("Red").extend({ required: true });
			this.team2 = ko.observable("Blue").extend({ required: true });

			this.is_valid = ko.validatedObservable({
				name: this.name,
				region: this.region,
				team1: this.team1,
				team2: this.team2,
				battleground: this.battleground
			});

			this.can_save = ko.pureComputed(function(){
				return this.is_valid.isValid();
			},this);
		}

		Panel.prototype.init = function() {
			
		};

		Panel.prototype.dispose = function() {
			
		};

		Panel.prototype.save = function() {
			var data = {
				name: this.name(),
				region: this.region(),
				team1: this.team1(),
				team2: this.team2(),
				battleground_id: ko.unwrap(this.battleground().id)
			};
			this.appl.send("create_lobby",{data:data},function(response){
				if(response.error){
					this.error(response.error);
					return;
				}
				console.log(data);
				this.appl.close_dialog();
			},this);
		};

		return {
			template: main_tmpl,
			viewModel: Panel
		};
	}
);