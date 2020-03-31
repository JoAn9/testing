// it - pojedynczy test
// describe - grupa testów
// describe.skip & it.skip - skip these tests
// only - call only this test

const todo = require('./todo');

let req;
let res;

function expectStatus(status) {
  if (status === 200) return;
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(status);
}

function expectResponse(json) {
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledWith(json);
  expect(res.send).not.toHaveBeenCalled();
}

function expectTextResponse(text) {
  expect(res.send).toHaveBeenCalledTimes(1);
  expect(res.send).toHaveBeenCalledWith(text);
  expect(res.json).not.toHaveBeenCalled();
}

beforeEach(() => {
  req = {
    params: {},
  };
  res = {
    json: jest.fn(),
    send: jest.fn(),
    status: jest.fn(),
  };
});

describe('list', () => {
  it('works', () => {
    todo.list(req, res);

    const todos = todo.getTodos();
    expectStatus(200);
    expectResponse(todos);
  });
});

describe('create', () => {
  it('works', () => {
    const name = 'lunch';
    const todos = todo.getTodos();
    const { length } = todos;

    req.body = { name };
    todo.create(req, res);

    expectStatus(200);
    expectResponse(todos[todos.length - 1]);
    expect(todos).toHaveLength(length + 1);
    expect(todos[todos.length - 1]).toMatchObject({
      name,
      completed: false,
    });
    expect(new Set(todos.map(item => item.id)).size).toEqual(todos.length);
  });

  it('handle case without req.body', () => {
    todo.create(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name is missing' });
  });

  it('handle case without req.body.name', () => {
    req.body = {};
    todo.create(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name is missing' });
  });

  it('handle case when req.body.name is empty string', () => {
    req.body = { name: '' };
    todo.create(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name should not be empty' });
  });

  it('handle case when req.body.name is empty string with only spaces', () => {
    req.body = { name: '    ' };
    todo.create(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name should not be empty' });
  });

  it('handle case when name is not a string', () => {
    req.body = { name: 100 };
    todo.create(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name should be a string' });
  });
});

describe('change', () => {
  const id = 100;
  const name = 'bath';
  const nextName = 'dinner';

  it('works', () => {
    //create new todo
    todo.addTodo(todo.createTodo(name, id));
    const todos = todo.getTodos();
    const { length } = todos;

    req.params.id = id;
    req.body = { name: nextName };
    todo.change(req, res);

    const newTodo = todos.find(item => item.id === id);

    expectStatus(200);
    expectResponse(newTodo);
    expect(todos).toHaveLength(length);
    expect(newTodo).toMatchObject({
      name: nextName,
    });
  });

  it('handle case with not proper id', () => {
    req.params.id = 'something';
    req.body = { name: nextName };
    todo.change(req, res);

    expectStatus(404);
    expectTextResponse('Not found');
  });

  it('handle case without req.body', () => {
    req.params.id = id;
    todo.change(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name is missing' });
  });

  it('handle case without req.body.name', () => {
    req.params.id = id;
    req.body = {};
    todo.change(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name is missing' });
  });

  it('handle case when req.body.name is empty string', () => {
    req.params.id = id;
    req.body = { name: '' };
    todo.change(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name should not be empty' });
  });

  it('handle case when req.body.name is empty string with only spaces', () => {
    req.params.id = id;
    req.body = { name: '    ' };
    todo.change(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name should not be empty' });
  });

  it('handle case when name is not a string', () => {
    req.params.id = id;
    req.body = { name: 100 };
    todo.change(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name should be a string' });
  });
});
