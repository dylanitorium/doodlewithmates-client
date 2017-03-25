import Ember from 'ember';
import config from '../../config/environment';

const { inject: { service } } = Ember;

const userById = (id) => (user => (user.get('id') !== id));

export default Ember.Controller.extend({
  socketIo: service('socket-io'),
  session: service(),
  sessionAccount: service('session-account'),
  socket: null,
  color: '#333',
  init: function () {
    this._super.apply(this, arguments);
    this.set('socket', this.get('socketIo').socketFor(config.APP.SERVER));
    this.get('socket').emit('afterConnection', this.get('session.data.authenticated.token'));
    this.get('socket').on('user:activated', (data) => {
      this.get('users').update();
    });
    this.get('socket').on('user:deactivated', (data) => {
      this.get('users').update();
    });
  }

});
