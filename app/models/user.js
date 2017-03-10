import DS from 'ember-data';

export default DS.Model.extend({
  picture: DS.attr(),
  name: DS.attr(),
  color: DS.attr(),
});
