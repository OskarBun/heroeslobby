'''
Created on 12 Sep 2015

@author: peterb
'''
from pkg_resources import resource_filename  # @UnresolvedImport
from tornado.options import options, define, parse_command_line,\
    parse_config_file
import tornado.ioloop
import tornado.web
import logging
import os

from blueshed.utils.utils import patch_tornado
from blueshed.handlers.login_handler import LoginHandler
from blueshed.handlers.logout_handler import LogoutHandler
from blueshed.handlers.index_handler import IndexHandler
from blueshed.handlers.websocket_auth_handler import WebsockeAuthtHandler

from lobby.control.control import Control


define("port", 8080, int, help="port to listen on")
define("debug", default='yes', help="debug yes or no - autoreload")
define("db_url", default='sqlite:///lobby.db', help="database url")

patch_tornado()

def main():
    config_path = "lobby.conf"
    if os.path.isfile(config_path):     
        logging.info("loading config file")       
        parse_config_file(config_path)
    
    parse_command_line()
    
    port = int(os.environ.get("PORT", options.port))
    db_url = os.environ.get("CLEARDB_DATABASE_URL",options.db_url)
                    
    control = Control(db_url=db_url,drop_all=True)
    
    handlers = [
        (r"/websocket", WebsockeAuthtHandler),
        (r"/login(.*)", LoginHandler),
        (r"/logout", LogoutHandler),
        (r"/", IndexHandler),
    ]
    settings = {
        "static_path": resource_filename('lobby.web',"www/static"),
        "template_path": resource_filename('lobby.web',"www/templates"),
        "cookie_secret": 'lobby.simple-secret',
        "cookie_name": 'lobby.simple-user',
        "login_url": '/login',
        "gzip": True,
        "control": control,
        "debug": options.debug
    }
    
    application = tornado.web.Application(handlers, **settings)
    application.listen(port)
    logging.info("listening on port {}".format(port))
    logging.info("mode:{}".format("production" if options.debug=='no' else 'debug'))
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()
