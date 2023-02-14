import request from 'supertest';
import Message from '../src/v1/lang/en.lang'
import server from '../src/server';

describe('API Active Account Endpoints', () => {
  it('check token is empty', async () => {
    const res = await request(server).get('/v1/auth/active?userId=5')
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual(Message.token_and_userId_required);
  });

  it('check userId is empty', async () => {
    const res = await request(server).get('/v1/auth/active?token=ahsd')
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual(Message.token_and_userId_required);
  });

  it('check token and userId are empty', async () => {
    const res = await request(server).get('/v1/auth/active')
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual(Message.token_and_userId_required);
  });

  it('check token is wrong format', async () => {
    const res = await request(server).get('/v1/auth/active?token=123123&userId=5')
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual(Message.token_invalid);
  });

  it('check userId is wrong format', async () => {
    const res = await request(server).get('/v1/auth/active?token=375a19ea-d382-48c4-aa87-d191009e581e&userId=he')
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual(Message.user_id_invalid);
  });
 
  it('check token is wrong with database', async () => {
    const res = await request(server).get('/v1/auth/active?token=375a19ea-d382-48c4-aa87-d191009e581e&userId=2')
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual(Message.token_expired);
  });

  // resend email api
  it('check email is invalid to resend again', async () => {
    const res = await request(server).post('/v1/auth/resend')
      .send({
        email:'baotrandinh'
      })
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual('email must be a valid email');
  });

  it('check account is activated that not allow to resend', async () => {
    const res = await request(server).post('/v1/auth/resend')
      .send({
        email:'baotrandinh.ute@gmail.com'
      })
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual(Message.account_activated);
  });

})