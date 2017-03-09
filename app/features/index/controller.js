import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Controller.extend({
  socketIo: service('socket-io'),
  session: service(),
  socket: null,
  init: function () {
    this._super.apply(this, arguments);
    this.set('socket', this.get('socketIo').socketFor('http://localhost:8080'));
    this.get('socket').emit('afterConnection', this.get('session.data.authenticated.token'));
    this.get('socket').on('update', (data) => {
      console.log(data);
    });
  }
});
