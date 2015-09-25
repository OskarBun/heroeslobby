define([
		"knockout",
		"knockout-mapping"
	],
	function(ko,mapping){

		function Lobby(options){
			this._type = "Lobby";
			this.id = ko.observable();
			this.name = ko.observable();

			if(options){
				this.update(options);
			}
		}

		Lobby.prototype.update = function(options) {
			mapping.fromJS(options,{},this);
			return this;
		};


		Lobby.prototype.save = function() {
			return mapping.toJS(this);
		};

		return Lobby;
	}
);