import Torii from 'ember-simple-auth/authenticators/torii';
import config from '../config/environment';


const {inject: { service } } = Ember;

export default Torii.extend({
  torii: service(),
  ajax: service(),

  restore(data) {
    return new Promise((resolve, reject) => {
      if (!Ember.isEmpty(data.token)) {
        resolve(data);
      } else {
        reject();
      }
    });
  },

  authenticate() {
    const ajax = this.get('ajax');
    return this._super(...arguments).then((data) => (
      ajax.request(`${config.APP.SERVER}/api/login`, {
        type: 'POST',
        data: JSON.stringify({
          'grant_type': 'facebook_auth_code',
          'auth_code': data.authorizationCode
        }),
        contentType: 'application/json',
        dataType: 'json'
      }).then((response) => ({
        token: response.token,
      }))
    ));
  },

  invalidate(data) {
    return Promise.resolve(data);
  }
});
