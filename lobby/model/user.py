'''
Created on 12 Sep 2015

@author: peterb
'''
from blueshed.model_helpers.base import Base
from sqlalchemy.types import String, Integer
from sqlalchemy.schema import Column
from sqlalchemy.orm import relationship


class User(Base):
    
    id = Column(Integer, primary_key=True)
    _oauth = Column(String(255))
    name = Column(String(255))
    _password = Column(String(80))
    
    lobbies = relationship('Lobby', uselist=True, 
        primaryjoin='Lobby.owner_id==User.id',
        remote_side='Lobby.owner_id',
        back_populates='owner')
    
    games = relationship('Lobby',
        secondaryjoin='Lobby.id==lobby_players_user.c.players_id',
        primaryjoin='User.id==lobby_players_user.c.user_id',
        secondary='lobby_players_user',
        back_populates='players')

    teams = relationship('Team',
        secondaryjoin='Team.id==team_members_user.c.members_id',
        primaryjoin='User.id==team_members_user.c.user_id',
        secondary='team_members_user',
        back_populates='members')