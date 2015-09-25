'''
Created on 12 Sep 2015

@author: peterb
'''
import unittest
from blueshed.utils.utils import dumps
from lobby.tests._test_control_ import TestControl
from lobby import model
from lobby.views.lobby_view import json_lobby



class Test(unittest.TestCase):


    def setUp(self):
#         self.control = TestControl(db_url="sqlite:///",drop_all=True)
        self.control = TestControl(db_url="sqlite:///../web/lobby.db",drop_all=True)


    def tearDown(self):
        pass


    def testName(self):
        with self.control.session as session:
            foo = model.User(name="foo",_password="foo")
            bar = model.User(name="bar",_password="bar")
            session.add_all([foo,bar])
            session.flush()
            
            btgs = [model.Battleground(name="Garden of Terror"),
                    model.Battleground(name="Tomb of the Spider Queen")]
            session.add_all(btgs)
            
            lobby = model.Lobby(name="Foo's Lobby",
                                region=model.Lobby.REGION[0],
                                battleground=btgs[0])
            foo.lobbies.append(lobby)
            
            red = model.Team(name="Red")
            lobby.teams.append(red)
            blue = model.Team(name="Blue")
            lobby.teams.append(blue)
            
            red.members.append(foo)
            blue.members.append(bar)
            
            session.commit()
            
        print(dumps(self.control.get_lobby(1, 1),indent=2))
            

if __name__ == "__main__":
    #import sys;sys.argv = ['', 'Test.testName']
    unittest.main()