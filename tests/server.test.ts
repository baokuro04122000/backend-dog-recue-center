import server from '../src/server';

import request from 'supertest';

test('[GET] /_healthcheck', async () => {
  const res = await request(server).get('/_healthcheck');
  expect(typeof res.body.uptime).toBe('number');
});