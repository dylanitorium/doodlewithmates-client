const express = require('express');
const app = express();
const port = process.env.PORT || '8888';
app.use(express.static('dist'));
app.listen(port, '127.0.0.1', () => {
  console.log(`Listening on: http://127.0.0.1:${port}`);
});
