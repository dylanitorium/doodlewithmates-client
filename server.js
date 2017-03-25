const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || '8888';
app.use(express.static('dist'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '.', 'dist', 'index.html'));
});
app.listen(port, '127.0.0.1', () => {
  console.log(`Listening on: http://127.0.0.1:${port}`);
});
