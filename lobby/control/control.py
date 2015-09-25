'''
Created on 12 Sep 2015

@author: peterb
'''
from blueshed.model_helpers.base_control import BaseControl
from blueshed.model_helpers import model_utils
from lobby import model
import functools
from blueshed.utils.status import Status
from lobby.views.lobby_view import json_lobby
from blueshed.utils.utils import dumps


class Control(BaseControl):
    
    def __init__(self, db_url, queue=None, echo=False, pool_recycle=None, drop_all=False):
        BaseControl.__init__(self, db_url, echo=echo, pool_recycle=pool_recycle)
        self._queue = queue
        self._status = Status(functools.partial(self._broadcast,'_service_status_'))
        self._fc_description = None
        self._fc_methods = None
        
        if drop_all is True:
            with self.session as session:
                model_utils.drop_all(session)
        
        model_utils.create_all(model.Base, self._engine)
        
        if drop_all:
            with self.session as session:
                session.add(model.User(name="admin",_password="admin"))
                session.commit()
                
                
    def _broadcast(self, signal, message, accl=None):
        if self._queue:
            self._queue.post(dumps({"signal":signal, "message":message}))
        else:
            BaseControl._broadcast(self, signal, message, accl)
                
                
    def _begin_web_session(self, accl, client, ip_address, headers):
        if accl:
            with self.session as session:
                user = session.query(model.User).get(accl)
                self._clients.append(client)
                self._status['clients']=list(set(client.current_user for client in self._clients)) 
                result = user._serialize
                return result                    
                
        
    def _end_web_session(self, client):
        if client in self._clients:
            self._clients.remove(client)
        self._status['clients']=list(set(client.current_user for client in self._clients))

                
                
    def login(self,username, password):
        
        with self.session as session:
            user = session.query(model.User).filter(model.User.name==username,
                                                    model.User._password==password).first()
            if user:
                return str(user.id)
            raise Exception("Email or password incorrect!")


    def _get_user(self, user_id):
        if user_id is None: return
        with self.session as session:
            user = session.query(model.User).get(user_id)
            return user._serialize
        
        
    def change_password(self, accl, old_password, new_password):
        with self.session as session:
            accl_user = session.query(model.User).get(accl)
            if old_password != accl_user._password:
                raise Exception("old password does not match")
            accl_user._password = new_password
            session.commit()
            return True
                
        
    def get_lobbies(self, accl, region=None):
        with self.session as session:
            query = session.query(model.Lobby)
            if region:
                query = query.\
                        filter(model.Lobby.region==region)
            
            return [json_lobby(lobby) for lobby in query]
        
        
    def get_battlegrounds(self, accl):
        with self.session as session:
            query = session.query(model.Battleground).\
                            order_by(model.Battleground.name)
            return [row._serialize for row in query]
        
        
    def get_lobby(self, accl, lobby_id):
        with self.session as session:
            lobby = session.query(model.Lobby).get(lobby_id)
            return json_lobby(lobby)
        
    
    def create_lobby(self, accl, data):
        with self.session as session:
            user = session.query(model.User).get(accl)
            lobby = model.Lobby(name=data["name"],
                                region=data["region"],
                                battleground_id=data["battleground_id"],
                                owner=user)
            session.add(lobby)
            lobby.teams.append(model.Team(name=data["team1"]))
            lobby.teams.append(model.Team(name=data["team2"]))
            session.commit()
            self._broadcast_on_success("lobby created", json_lobby(lobby))
            return lobby.id
            
    
    def save_lobby(self, accl, lobby):
        with self.session as session:
            lobby = session.query(model.Lobby).get(lobby.id)
            lobby._serialize = lobby
            session.commit()
            self._broadcast_on_success("lobby updated", json_lobby(lobby))
            return True
        
        