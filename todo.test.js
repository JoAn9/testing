// it - pojedynczy test
// describe - grupa testów

const todo = require('./todo');

const todos = [
  { id: 1, name: 'shower', completed: false },
  { id: 2, name: 'shopping', completed: false },
];

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
}

beforeEach(() => {
  req = {};
  res = {
    json: jest.fn(),
    status: jest.fn(),
  };
});

describe('list', () => {
  it('works', () => {
    todo.list(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(todos);
  });
});

describe('create', () => {
  it('works', () => {
    req.body = { name: 'lunch' };
    todo.create(req, res);

    expectStatus(200);
    expectResponse('Create: lunch');
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
