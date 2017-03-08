import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Controller.extend({
  socketIo: service('socket-io'),
  session: service(),
  init: function () {
    this._super.apply(this, arguments);
    const socket = this.get('socketIo').socketFor('http://localhost:8080');
    socket.emit('afterConnection', this.get('session.data.authenticated'));

  },
  willDestroy: function () {
    this.get('socketIo').closeSocketFor('http://localhost:8080');
  }
});
