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
      return (item.get('active') === true && item.get('id') !== currentUser.get('id'));
    }
  },
  model: function() {
    return RSVP.hash({
      users: this.get('store').filter('user', this.filterUsers()),
    })
  },
  setupController(controller, models) {
    controller.setProperties(models);
  },
});
