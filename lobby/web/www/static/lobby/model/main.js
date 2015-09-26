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
					response.result.map(function(item){
						this._add_lobby(item);
					},this);
				},this);
			return this.lobbies;
		};
		

		Store.prototype.get_lobby = function(id, callback){
			var lobby = this.lobbies().find(function(item){
				return ko.unwrap(item.id)==id;
			});
			if(!lobby){
				this.appl.send("get_lobby",{lobby_id:id},
					function(response){
						if(response.error){
							this.appl.error(response.error);
							return;
						}
						lobby = this._add_lobby(response.result);
						callback(lobby);
					},this);
			}
			else{
				callback(lobby);
			}
		};

		Store.prototype._add_lobby = function(data) {
			var lobby = this.lobbies().find(function(item){
				return ko.unwrap(item.id)==data.id;
			});
			if(!lobby){
				lobby = new Lobby(data);
				this.lobbies.push(lobby);
			}
			return lobby;
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
