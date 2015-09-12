from blueshed.model_helpers.base import Base
from sqlalchemy.types import String, Integer, Numeric, DateTime, Date, Time, Enum, Boolean, Text
from sqlalchemy.schema import Table, Column, ForeignKey
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.declarative.api import declared_attr, has_inherited_table, declarative_base
import re



lobby_players_user = Table('lobby_players_user', Base.metadata,
    Column('players_id', Integer, ForeignKey('lobby.id')),
    Column('user_id', Integer, ForeignKey('user.id')),
    mysql_comment='{\"back_ref\":\"Lobby.players\", \"back_populates\":\"User.games\"}',
    mysql_engine='InnoDB')


class User(Base):
    
    id = Column(Integer, primary_key=True)
    oauth = Column(String(255))
    name = Column(String(255))
    lobbies = relationship('Lobby', uselist=True, 
        primaryjoin='Lobby.owner_id==User.id',
        remote_side='Lobby.owner_id',
        back_populates='owner')
    games = relationship('Lobby',
        secondaryjoin='Lobby.id==lobby_players_user.c.players_id',
        primaryjoin='User.id==lobby_players_user.c.user_id',
        secondary='lobby_players_user',
        lazy='joined', back_populates='players')


class Lobby(Base):
    
    STATUS = ['open','closed']
    
    GAME_STATUS = ['setup','started','ended']
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    status = Column(Enum(*STATUS))
    owner_id = Column(Integer, ForeignKey('user.id'))
    owner = relationship('User', uselist=False,
        primaryjoin='Lobby.owner_id==User.id', 
        remote_side='User.id',
        back_populates='lobbies')
    players = relationship('User',
        primaryjoin='Lobby.id==lobby_players_user.c.players_id',
        secondaryjoin='User.id==lobby_players_user.c.user_id',
        secondary='lobby_players_user',
        lazy='joined', back_populates='games')
    mumble = Column(String(255))
    mumble_users = Column(String(255))
    draft_url = Column(String(255))
    game_status = Column(Enum(*GAME_STATUS))
    hots_logs_ref = Column(String(255))

