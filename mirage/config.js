export default function() {
  this.namespace = '/api';

  this.get('/users', function() {
    return {
      data: [
        {
          type: 'user',
          id: 'dylan-sweetensen',
          attributes: {
            name: 'Dylan Sweetensen',
            image: 'http://www.fillmurray.com/100/100',
            color: '#333',
          }
        },
        {
          type: 'user',
          id: 'georgina-shaw',
          attributes: {
            name: 'Georgina Shaw',
            image: 'http://www.fillmurray.com/100/100',
            color: '#333',
          },
        },
      ]
    };
  });
}
