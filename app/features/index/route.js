import Ember from 'ember';
import RSVP from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const { inject: { service }, Route } = Ember;


export default Ember.Route.extend(AuthenticatedRouteMixin, {
  session: service('session'),
  sessionAccount: service('session-account'),
  filterUsers: function () {
    const self = this;
    return function (item) {
      const currentUser = self.get('sessionAccount').get('account');
      return (item.get('isActive') === true && item.get('id') !== currentUser.get('id'));
    }
  },
  model: function() {
    return RSVP.hash({
      users: this.get('sessionAccount').loadCurrentUser().then(() => this.get('store').filter('user', this.filterUsers())),
      canvasUsers: this.get('store').findAll('user'),
    })
  },
  setupController(controller, models) {
    controller.setProperties(models);
  },
});
