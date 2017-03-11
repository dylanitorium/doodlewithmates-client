import Ember from 'ember';
import RSVP from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function() {
    return RSVP.hash({
      users: this.get('store').query('user', {active: true}),
    })
  },
  setupController(controller, models) {
    controller.setProperties(models);
  },
});
