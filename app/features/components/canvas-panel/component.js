import Ember from 'ember';

const { inject: { service }, Component } = Ember;

export default Ember.Component.extend({
  sessionAccount: service('session-account'),
  store: service(),

  // Element
  tagName: 'canvas',
  width: 1200,
  height: 440,
  style: 'border: 1px solid black; margin-top: 30px;',
  attributeBindings: ['width','height', 'id', 'style'],

  // State
  paths: {},
  isDrawing: false,
  canvas: null,
  canvasContext: null,
  strokeSize: '3',

  // ====================================
  /* Path Handling */
  initPaths: function () {
    const users = this.get('users');
    users.forEach(this.initUserPath());
    this.redraw();
  },
  initUserPath: function () {
    const self = this;
    return function (user) {
      const { id, path, color } = user.getProperties('id', 'path', 'color');
      self.addOrReplacePath(id, path, color);
    }
  },
  createEmptyPath: function (color) {
    return {
      color: color || '#333',
      xCoordinates: [],
      yCoordinates: [],
      dragCoordinates: [],
    }
  },
  getFormattedPath: function(id, path, color) {
    const paths = this.get('paths');
    if (this.doesPathExistForId(id)) {
      return {
        color: paths[id].color,
        ...path
      };
    } else {
      if(!path) {
        return this.createEmptyPath(color);
      } else {
        return { ...path, color };
      }
    }
  },
  getAllPathsAsArray: function () {
    const paths = this.get('paths');
    return Object.keys(paths).map(key => paths[key]);
  },
  addToMyPath: function(x, y, drag) {
    const user = this.get('sessionAccount').get('account');
    const path = this.addToUserPath(user, x, y, drag);
    this.emitDraw({
      id: user.get('id'),
      path,
    });
  },
  getMyPath: function () {
    const user = this.get('sessionAccount').get('account');
    return this.getUserPath(user.get('id'));
  },
  addToUserPath: function(user, x, y, drag) {
    const paths = this.get('paths');
    const { id, color } = user.getProperties('id', 'color');
    const path = (this.doesPathExistForId(id)) ? paths[id] : this.createEmptyPath(color);
    this.set('paths', Object.assign({}, paths, {
      [id]: this.addToPath(path, x, y, drag),
    }));
    return path;
  },
  getUserPath: function (id) {
    const paths = this.get('paths');
    return paths[id];
  },
  addOrReplacePath: function (id, path, color) {
    this.set('paths', Object.assign({}, this.get('paths'), {
      [id]: this.getFormattedPath(id, path, color),
    }));
  },
  addToPath: function (path, x, y, drag) {
    const { xCoordinates, yCoordinates, dragCoordinates } = path;
    return Object.assign({}, path, {
      xCoordinates: [...xCoordinates, x],
      yCoordinates: [...yCoordinates, y],
      dragCoordinates: [...dragCoordinates, drag],
    })
  },
  doesPathExistForId: function (id) {
    const paths = this.get('paths');
    return typeof paths[id] !== 'undefined';
  },
  // ====================================
  /* Sockect Events */
  emitDraw: function (payload) {
    this.get('socket').emit('draw:progress', payload);
  },
  emitDrawEnd: function (payload) {
    this.get('socket').emit('draw:end', payload);
  },
  // ====================================
  /* Canvas Helpers */
  getOffset: function (element) {
    element = element.getBoundingClientRect();
    return {
      left: element.left + window.scrollX,
      top: element.top + window.scrollY
    }
  },
  getYLocation: function ({ pageY }) {
    return pageY - this.getOffset(this.get('canvas')).top;
  },
  getXLocation: function ({ pageX }) {
    return pageX - this.getOffset(this.get('canvas')).left;
  },
  // ====================================
  /* Drawing */
  clearCanvas: function () {
    this.get('canvasContext').clearRect(0, 0, this.get('width'), this.get('height'));
  },
  drawPath: function() {
    const canvasContext = this.get('canvasContext');
    canvasContext.lineJoin = 'round';
    canvasContext.lineWidth = 3;
    return function (path) {
      const { xCoordinates, dragCoordinates, yCoordinates, color } = path;
      canvasContext.strokeStyle = color;
      for (let index = 0; index < xCoordinates.length; index++) {
        canvasContext.beginPath();
        if (dragCoordinates[index] && index) {
          canvasContext.moveTo(xCoordinates[index-1], yCoordinates[index-1]);
        } else {
          canvasContext.moveTo(xCoordinates[index]-1, yCoordinates[index]);
        }
        canvasContext.lineTo(xCoordinates[index], yCoordinates[index]);
        canvasContext.closePath();
        canvasContext.stroke();
      }
    }
  },
  redraw: function () {
    this.clearCanvas();
    this.getAllPathsAsArray().forEach(this.drawPath());
  },

  // ====================================
  /* Sockets */
  subscribeToChanges: function () {
    this.get('socket').on('draw:change', this.handleCanvasUpdate());
    this.get('socket').on('user:deactivated', this.handleUserChange());
  },
  handleCanvasUpdate: function () {
    const self = this;
    return function ({ id, path }) {
      self.addOrReplacePath(id, path);
      self.redraw();
    }
  },
  handleUserChange: function () {
    const self = this;
    return function (data) {
      const { fbid } = data;
      self.addOrReplacePath(fbid, null);
      self.redraw();
    }
  },

  // ====================================
  /* Element */
  didInsertElement: function () {
    this.set('canvas',  this.get('element'));
    this.set('canvasContext', this.get('canvas').getContext('2d'));
    this.initPaths();
    this.subscribeToChanges();
  },
  mouseDown: function(event) {
    this.set('isDrawing', true);
    this.addToMyPath(this.getXLocation(event), this.getYLocation(event));
    this.redraw();
  },
  mouseMove: function(event) {
    if (this.get('isDrawing')) {
      this.addToMyPath(this.getXLocation(event), this.getYLocation(event), true);
      this.redraw();
    }
  },
  mouseUp: function(event) {
    this.set('isDrawing', false);
    const user = this.get('sessionAccount').get('account');
    const path = this.getMyPath();
    this.emitDrawEnd({
      fbid: user.get('id'),
      path,
    });
  },
  mouseLeave: function(event) {
    this.set('isDrawing', false);
  },
});
