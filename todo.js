const { respondNotFound, respondWithError } = require('./utils');

let todoId = 1;

function getId() {
  const currentId = todoId;
  todoId += 1;
  return currentId;
}

function createTodo(name, id = getId()) {
  return { id, name, completed: false };
}

let todos = [createTodo('shower'), createTodo('shopping')];

function addTodo(todo) {
  todos.push(todo);
}

exports.getTodos = () => todos;
exports.createTodo = createTodo;
exports.addTodo = addTodo;

function verifyName(req, res) {
  if (!req.body || !req.body.hasOwnProperty('name')) {
    return respondWithError(res, 'Name is missing');
  }
  let { name } = req.body;
  if (typeof name !== 'string') {
    return respondWithError(res, 'Name should be a string');
  }
  name = name.trim();
  if (name === '') {
    return respondWithError(res, 'Name should not be empty');
  }
  return { name };
}

exports.list = (req, res) => {
  res.json(todos);
};

exports.create = (req, res) => {
  const name = verifyName(req, res);
  if (!name) return;
  const todo = createTodo(name.name);
  addTodo(todo);
  res.json(todo);
};

exports.change = (req, res) => {
  const name = verifyName(req, res);
  if (!name) return;
  const todo = todos.find(item => item.id === req.params.id);
  if (typeof todo === 'undefined') {
    return respondNotFound(res);
  }
  todo.name = name.name;
  res.json(todo);
};

exports.delete = (req, res) => {
  res.json(`Delete: ${req.params.id}`);
};

exports.toggle = (req, res) => {
  res.json(`Toggle: ${req.params.id}`);
};
