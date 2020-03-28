const bodyParser = require('body-parser');
const express = require('express');

const todo = require('./todo');

const app = express();

app.set('x-powered-by', false);
app.use(bodyParser.json());

app.get('/', todo.list);
app.post('/', todo.create);
app.put('/:id', todo.change);
app.delete('/:id', todo.delete);
app.post('/:id/toggle', todo.toggle);

app.get('*', (req, res) => {
  res.status(404);
  res.send('not found');
});

app.use((error, req, res, next) => {
  res.status(500);
  res.send('Error');
});

module.exports = app;
