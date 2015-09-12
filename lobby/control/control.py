'''
Created on 12 Sep 2015

@author: peterb
'''
from blueshed.model_helpers.base_control import BaseControl
from blueshed.model_helpers import model_utils
from lobby import model
import functools
from blueshed.utils.status import Status


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
                session.add(model.User(name="admin"))
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
        self._clients.remove(client)
        self._status['clients']=list(set(client.current_user for client in self._clients))

                
                
    def login(self,username, password):
        
        with self.session as session:
            user = session.query(model.User).filter(model.User.name==username).first()
            if user:
                return str(user.id)
            raise Exception("Email or password incorrect!")


    def _get_user(self, user_id):
        if user_id is None: return
        with self.session as session:
            user = session.query(model.User).get(user_id)
            return user._serialize

        