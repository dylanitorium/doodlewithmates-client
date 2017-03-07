import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Controller.extend({
  socketIo: service('socket-io'),
  init: function () {
    this._super.apply(this, arguments);
    const socket = this.get('socketIo').socketFor('http://localhost:8080');

    socket.emit('test', 'yeaaaaah');
    socket.on('connect', () => {
      socket.on('respond', (data) => {
        console.log(data);
      })
    });
  },
  willDestroy: function () {
    this.get('socketIo').closeSocketFor('http://localhost:8080');
  }
});
