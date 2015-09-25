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

from blueshed.utils.utils import patch_tornado, gen_token
from blueshed.handlers.login_handler import LoginHandler
from blueshed.handlers.logout_handler import LogoutHandler
from blueshed.handlers.page_handler import PageHandler
from blueshed.handlers.websocket_auth_handler import WebsockeAuthtHandler

from lobby.control.control import Control
from blueshed.utils.pika_broadcaster import PikaBroadcaster


define("port", 8080, int, help="port to listen on")
define("debug", default='no', help="debug yes or no - autoreload")
define("db_url", default='sqlite:///lobby.db', help="database url")
define("db_pool_recycle", 60, int, help="how many seconds to recycle db connection")
define("multi", default='local', help="are we talking to queues")

patch_tornado()

def main():
    config_path = "lobby.conf"
    if os.path.isfile(config_path):     
        logging.info("loading config file")       
        parse_config_file(config_path)
    
    parse_command_line()
    
    queue = None
    if options.multi == "rabbit":
        queue = PikaBroadcaster(os.environ.get("CLOUDAMQP_URL"))
        queue.connect()
        logging.info("connecting to queue...")

    
    port = int(os.environ.get("PORT", options.port))
    db_url = os.environ.get("CLEARDB_DATABASE_URL",options.db_url)
    if db_url.startswith("mysql://"):
        db_url = "mysql+pymysql://" + db_url[len("mysql://"):]
        if db_url.endswith("?reconnect=true"):
            db_url = db_url[:-len("?reconnect=true")]
                    
    control = Control(db_url=db_url,
                      pool_recycle=options.db_pool_recycle,
                      queue=queue,
                      drop_all=False)
    
    if queue:
        queue.set_clients(control._clients)
    
    handlers = [
        (r"/websocket", WebsockeAuthtHandler),
        (r"/login(.*)", LoginHandler),
        (r"/logout", LogoutHandler),
        (r"/", PageHandler,{"mode":'debug' if options.debug=='yes' else 'built'}),
    ]
    settings = {
        "static_path": resource_filename('lobby.web',"www/static"),
        "template_path": resource_filename('lobby.web',"www/templates"),
        "cookie_secret": 'lobby.simple-secret',
        "cookie_name": 'lobby.simple-user',
        "login_url": '/login',
        "gzip": True,
        "control": control,
        "debug": options.debug,
        "ws_config":{
            "server_id": gen_token(8)
        }
    }
    
    application = tornado.web.Application(handlers, **settings)
    application.listen(port)
    logging.info("listening on port {}".format(port))
    logging.info("mode:{}".format("production" if options.debug=='no' else 'debug'))
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()
