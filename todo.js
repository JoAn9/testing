let todoId = 1;
function getId() {
  const currentId = todoId;
  todoId += 1;
  return currentId;
}
function createTodo(name) {
  const id = getId();
  return { id, name, completed: false };
}
let todos = [createTodo('shower'), createTodo('shopping')];

exports.getTodos = () => todos;

function respondWithError(res, errorMsg) {
  res.status(400);
  res.json({ error: errorMsg });
}

exports.list = (req, res) => {
  res.json(todos);
};

exports.create = (req, res) => {
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
  const todo = createTodo(name);
  todos.push(todo);
  return res.json(todo);
};

exports.change = (req, res) => {
  res.json(`Change: ${req.params.id}`);
};

exports.delete = (req, res) => {
  res.json(`Delete: ${req.params.id}`);
};

exports.toggle = (req, res) => {
  res.json(`Toggle: ${req.params.id}`);
};
