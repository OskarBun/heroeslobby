'''
Created on 12 Sep 2015

@author: peterb
'''
import unittest
from blueshed.utils.utils import dumps
from lobby.tests._test_control_ import TestControl
from lobby import model



class Test(unittest.TestCase):


    def setUp(self):
        self.control = TestControl(db_url="sqlite:///",drop_all=True)


    def tearDown(self):
        pass


    def testName(self):
        with self.control.session as session:
            session.add(model.User(name="foo"))
            session.commit()
            
            print(dumps(session.query(model.User).first()._serialize,indent=2))


if __name__ == "__main__":
    #import sys;sys.argv = ['', 'Test.testName']
    unittest.main()