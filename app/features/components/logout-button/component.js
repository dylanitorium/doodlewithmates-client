import Ember from 'ember';

const { inject: { service }, Component } = Ember;

export default Ember.Component.extend({
  session: service(),
  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
