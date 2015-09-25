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


class Control(BaseControl):
    
    def __init__(self, db_url, echo=False, pool_recycle=None, drop_all=False):
        BaseControl.__init__(self, db_url, echo=echo, pool_recycle=pool_recycle)
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
        
        
    def create_lobby(self, accl, team1=None, team2=None, **kwargs):
        with self.session as session:
            lobby = model.Lobby(owner_id=accl)
            lobby._serialize = kwargs
            lobby.teams.append(model.Team("Red" if team1 is None else team1))
            lobby.teams.append(model.Team("Blue" if team2 is None else team2))
            session.add(lobby)
            session.commit()
            return json_lobby(lobby)
        
        
    def get_lobbies(self, accl, region=None):
        with self.session as session:
            query = session.query(model.Lobby)
            if region:
                query = query.\
                        filter(model.Lobby.region==region)
            
            return [json_lobby(lobby) for lobby in query]
        
        
    def get_lobby(self, accl, lobby_id):
        with self.session as session:
            lobby = session.query(model.Lobby).get(lobby_id)
            return json_lobby(lobby)
        
        