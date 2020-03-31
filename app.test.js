const request = require('supertest');

const app = require('./app');

it('works', async () => {
  const response = await request(app).get('/');

  expect(response.status).toEqual(200);
  expect(response.header['content-type']).toEqual(
    'application/json; charset=utf-8'
  );
});

it('not works with creating a todo', async () => {
  const response = await request(app).post('/');

  expect(response.status).toEqual(400);
});

it('handle not found page', async () => {
  const response = await request(app).get('/something');

  expect(response.status).toEqual(404);
  // expect(response.text).toMatchSnapshot();
  expect(response.text).toEqual('Not found');
});
