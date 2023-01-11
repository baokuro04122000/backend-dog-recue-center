import request from 'supertest';

import server from '../src/server';

describe('API Authentication Endpoints', () => {
  it('check validation email for sign in', async () => {
    const res = await request(server).post('/v1/auth/sign-in')
      .send({
        email:"bao"
      })
    expect(res.status).toEqual(400); // bad request
    
  });

});