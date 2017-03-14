
import Ember from 'ember';

const { inject: { service }, RSVP, Service, isEmpty } = Ember;

export default Service.extend({
  session: service('session'),
  store: service(),

  loadCurrentUser() {
    return new RSVP.Promise((resolve, reject) => {
      const token = this.get('session.data.authenticated.token');
      console.log(token);
      if (token) {
        this.get('store').query('user', { token }).then((users) => {
          const user = users.get('firstObject');
          console.log(user);
          this.set('account', user);
          resolve();
        }, reject);
      } else {
        resolve();
      }
    });
  }
});
