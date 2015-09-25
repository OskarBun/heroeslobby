define([
		"knockout",
		"text!./main-tmpl.html"
	],
	function(ko, main_tmpl){

		function Panel(params){
			this.appl = params.appl;
			this.lobby = params.lobby;
			this.region_icon = "/static/images/"+params.lobby.region()+".svg";

			this.can_join = ko.pureComputed(function(){
				var user = null;
				if(this.appl.user()){
					var user_id = ko.unwrap(this.appl.user().id);
					this.lobby.teams().map(function(team){
						if(user==null){
							user = team.members().find(function(item){
								return ko.unwrap(item.id)==user_id;
							});
						}
					},this);
				}
				return user==null;
			},this);
		}

		Panel.prototype.init = function() {

		};

		Panel.prototype.dispose = function() {

		};

		Panel.prototype.team_member = function(team, index) {
			if(index < team.members().length){
				return team.members()[index];
			}
		};

    Panel.prototype.team_member_is_user = function(team, index) {
      var place = this.team_member(team, index), user = this.appl.user()
      return user && place && place.id() == user.id;
    }

		Panel.prototype.join = function(team) {

		};

		Panel.prototype.open = function() {

		};

		return {
			template: main_tmpl,
			viewModel: Panel
		};
	}
);
