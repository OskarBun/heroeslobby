define([
		"knockout",
		"./lobby",
		"./battleground"
	],
	function(ko, Lobby, Battleground){

		function Store(appl){
			this.appl = appl;
			this.appl.connection.broadcast.subscribe(this.handle_update,this);
			this.lobbies = ko.observableArray();
			this.battlegrounds = ko.observableArray();
		}

		Store.prototype.init = function() {
			this.appl.send("get_battlegrounds",{},
				function(response){
					if(response.error){
						this.appl.error(response.error);
						return;
					}
					this.battlegrounds(response.result.map(function(item){
						return new Battleground(item);
					}));
				},this);
		};


		Store.prototype.get_lobbies = function() {
			var result = this.lobbies;
			this.appl.send("get_lobbies",{},
				function(response){
					if(response.error){
						this.appl.error(response.error);
						return;
					}
					result(response.result.map(function(item){
						return new Lobby(item);
					}));
				});
			return this.lobbies;
		};



		Store.prototype.get_battlegrounds = function() {
			return this.battlegrounds;
		};


		Store.prototype.handle_update = function(msg) {
			if(msg.signal == "lobby created"){
				this.lobbies.push(new Lobby(msg.message));
			}
			else if(msg.signal == "lobby updated"){
				var lobby = this.lobbies().find(function(item){
					return ko.unwrap(item.id) == msg.message.id;
				});
				if(lobby){
					lobby.update(msg.message);
				}
			}
		};


		return Store;
	}
);
