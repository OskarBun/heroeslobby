'''
Created on 25 Sep 2015

@author: peterb
'''
from blueshed.model_helpers.base import Base
from sqlalchemy.types import String, Integer
from sqlalchemy.schema import Column


class Battleground(Base):
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255))