'''
Created on 25 Sep 2015

@author: peterb
'''
from blueshed.model_helpers.base import Base
from sqlalchemy.types import String, Integer
from sqlalchemy.schema import Table, Column, ForeignKey
from sqlalchemy.orm import relationship


team_members_user = Table('team_members_user', Base.metadata,
    Column('members_id', Integer, ForeignKey('team.id')),
    Column('user_id', Integer, ForeignKey('user.id')),
    mysql_comment='{\"back_ref\":\"Team.members\", \"back_populates\":\"User.teams\"}',
    mysql_engine='InnoDB')


class Team(Base):
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    lobby_id = Column(Integer, ForeignKey('lobby.id'))
    lobby = relationship('Lobby', uselist=False,
        primaryjoin='Team.lobby_id==Lobby.id', 
        remote_side='Lobby.id',
        back_populates='teams')
    members = relationship('User',
        primaryjoin='Team.id==team_members_user.c.members_id',
        secondaryjoin='User.id==team_members_user.c.user_id',
        secondary='team_members_user',
        back_populates='teams')