define([
		"knockout",
		"./lobby"
	],
	function(ko, Lobby){

		function Store(appl){
			this.appl = appl;
			this.appl.connection.broadcast.subscribe(this.handle_update,this);
			this.lobbies = ko.observableArray();
		}


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


		Store.prototype.handle_update = function(msg) {
			if(msg.signal == "lobby created"){
				this.lobbies.push(new Lobby(msg.message));
			}
			else if(msg.signal == "lobby updated"){
				var lobby = this.lobbies().find(function(item){
					return ko.unwrap(item.id);
				});
				if(lobby){
					lobby.update(msg.message);
				}
			}
		};

		
		return Store;
	}
);