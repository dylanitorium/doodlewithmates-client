import Ember from 'ember';

const { inject: { service } } = Ember;

const userById = (id) => (user => (user.get('id') !== id));
// const addUser

export default Ember.Controller.extend({
  socketIo: service('socket-io'),
  session: service(),
  socket: null,
  color: '#333',
  setColorIfShould: function({ new_val }) {
    const currentUser = this.get('session.data.authenticated.account');
    if (new_val.id === currentUser.get('id')) {
      this.set('color', new_val.color);
    }
  },
  init: function () {
    this._super.apply(this, arguments);
    this.get('store').query('user', { token: this.get('session.data.authenticated.token') }).then((users) => {
      const user = users.get('firstObject');
      this.set('session.data.authenticated.account', user);
    });
    this.set('socket', this.get('socketIo').socketFor('http://localhost:8080'));
    this.get('socket').emit('afterConnection', this.get('session.data.authenticated.token'));
    this.get('socket').on('update', (data) => {
      this.setColorIfShould(data);
      this.get('users').update();
    });
  }

});
