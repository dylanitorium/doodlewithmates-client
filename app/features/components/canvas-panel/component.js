import Ember from 'ember';

const { inject: { service }, Component } = Ember;

export default Ember.Component.extend({
  session:     service(),
  // Element
  tagName: 'canvas',
  width: 600,
  height: 300,
  style: 'border: 1px solid ;',
  attributeBindings: ['width','height', 'id', 'style'],

  // State
  isDrawing: false,
  isFirstContact: false,
  xCoordinates: [],
  yCoordinates: [],
  dragCoordinates: [],
  canvas: null,
  canvasContext: null,
  strokeColour: 'black',
  strokeSize: '3',

  // Functions
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
  addToPath: function (x, y, isDragging) {
    this.get('xCoordinates').pushObject(x);
    this.get('yCoordinates').pushObject(y);
    this.get('dragCoordinates').pushObject(isDragging);
  },
  redraw: function () {
    const {
      canvasContext,
      xCoordinates,
      yCoordinates,
      dragCoordinates,
    } = this.getProperties(
      'canvasContext',
      'xCoordinates',
      'yCoordinates',
      'dragCoordinates'
    );
    canvasContext.clearRect(0, 0, this.get('width'), this.get('height')); // Clears the canvas
    canvasContext.strokeStyle = this.get('strokeColour');
    canvasContext.lineJoin = 'round';
    canvasContext.lineWidth = this.get('strokeSize');

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
  },
  didInsertElement: function () {
    this.set('canvas',  this.get('element'));
    this.set('canvasContext', this.get('canvas').getContext('2d'));
  },
  mouseDown: function(event) {
    this.set('isDrawing', true);
    this.addToPath(this.getXLocation(event), this.getYLocation(event));
    this.redraw();
  },
  mouseMove: function(event) {
    if (this.get('isDrawing')) {
      this.addToPath(this.getXLocation(event), this.getYLocation(event), true);
      this.redraw();
    }
  },
  mouseUp: function(event) {
    this.set('isDrawing', false);
  },
  mouseLeave: function(event) {
    this.set('isDrawing', false);
  },

});
