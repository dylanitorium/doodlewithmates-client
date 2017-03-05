import DS from 'ember-data';

export default DS.Model.extend({
  image: DS.attr(),
  name: DS.attr(),
  color: DS.attr(),
});
