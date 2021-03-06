'''
Created on 12 Sep 2015

@author: peterb
'''
from blueshed.model_helpers.base import Base
from sqlalchemy.types import String, Integer, Enum
from sqlalchemy.schema import Table, Column, ForeignKey
from sqlalchemy.orm import relationship


lobby_players_user = Table('lobby_players_user', Base.metadata,
    Column('players_id', Integer, ForeignKey('lobby.id')),
    Column('user_id', Integer, ForeignKey('user.id')),
    mysql_comment='{\"back_ref\":\"Lobby.players\", \"back_populates\":\"User.games\"}',
    mysql_engine='InnoDB')


class Lobby(Base):
    
    STATUS = ['open','closed']
    
    GAME_STATUS = ['setup','started','ended']
    
    REGION = ['eu','na','asia']
    
    BATTLEGROUND_METHOD = ['draft','choose','random']
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    status = Column(Enum(*STATUS),
                    default=STATUS[0])
    owner_id = Column(Integer, ForeignKey('user.id'))
    owner = relationship('User', uselist=False,
        primaryjoin='Lobby.owner_id==User.id', 
        remote_side='User.id',
        back_populates='lobbies')
    players = relationship('User',
        primaryjoin='Lobby.id==lobby_players_user.c.players_id',
        secondaryjoin='User.id==lobby_players_user.c.user_id',
        secondary='lobby_players_user',
        back_populates='games')
    mumble = Column(String(255))
    mumble_users = Column(String(255))
    draft_url = Column(String(255))
    game_status = Column(Enum(*GAME_STATUS),
                         default=GAME_STATUS[0])
    hots_logs_ref = Column(String(255))
    region = Column(Enum(*REGION),nullable=False)
    battleground_id = Column(Integer, ForeignKey('battleground.id'))
    battleground = relationship('Battleground', uselist=False,
        primaryjoin='Lobby.battleground_id==Battleground.id', 
        remote_side='Battleground.id')
    battleground_method = Column(Enum(*BATTLEGROUND_METHOD),
                                 default=BATTLEGROUND_METHOD[0])
    
    teams = relationship('Team', uselist=True, 
        primaryjoin='Team.lobby_id==Lobby.id',
        remote_side='Team.lobby_id',
        back_populates='lobby')
    