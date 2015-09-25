'''
Created on 25 Sep 2015

@author: peterb
'''
import tornado.web
import tornado.auth


class OAuthHandler(tornado.web.RequestHandler,
                   tornado.auth.OAuthMixin):
    
    @tornado.gen.coroutine
    def get(self):
        if self.get_argument('code', False):
            user = yield self.get_authenticated_user(
                redirect_uri='http://your.site.com/auth/google',
                code=self.get_argument('code'))
            # Save the user with e.g. set_secure_cookie
        else:
            yield self.authorize_redirect(
                redirect_uri='http://your.site.com/auth/google',
                client_id=self.settings['oauth']['key'],
                scope=['profile', 'email'],
                response_type='code',
                extra_params={'approval_prompt': 'auto'})