import request from 'supertest';
import Message from '../src/v1/lang/en.lang'
import server from '../src/server';

describe('API Forgot Password Endpoints', () => {
  it('check email is invalid', async () => {
    const res = await request(server).post('/v1/auth/email-reset-password')
      .send({
        email:"bao"
      })
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual("email must be a valid email");
  });

  it('check email not exists', async () => {
    const res = await request(server).post('/v1/auth/email-reset-password')
      .send({
        email:"bao@gmail.com"
      })
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual(Message.email_not_exists);
  });

  it('check email not active', async () => {
    const res = await request(server).post('/v1/auth/email-reset-password')
      .send({
        email:"baotrandinh100@gmail.com"
      })
    
    expect(res.body.status).toEqual(403); // bad request
    expect(res.body.errors.message).toEqual(Message.email_not_active);
  });

  it('check email send success email', async () => {
    const res = await request(server).post('/v1/auth/email-reset-password')
      .send({
        email:"baotrandinh100@gmail.com"
      })
    
    expect(res.body.status).toEqual(403); // bad request
    expect(res.body.errors.message).toEqual(Message.email_not_active);
  });


  // validation for reset password
  it('check token is empty', async () => {
    const res = await request(server).post('/v1/auth/reset')
      .send({
        userId:2,
        password:'hello123@'
      })
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual('token is a required field');
  });

  it('check userId is empty', async () => {
    const res = await request(server).post('/v1/auth/reset')
      .send({
        token:"asdasd",
        password:'hello123@'
      })
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual('userId is a required field');
  });

  it('check token is wrong format', async () => {
    const res = await request(server).post('/v1/auth/reset')
      .send({
        userId:2,
        token:"dasdsa",
        password:'hello123@'
      })
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual(Message.token_invalid);
  });

  it('check userId is wrong format', async () => {
    const res = await request(server).post('/v1/auth/reset')
      .send({
        userId:'hi',
        token:"375a19ea-d382-48c4-aa87-d191009e581e",
        password:'hello123@'
      })
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual(Message.user_id_invalid);
  });
 
  it('check token is wrong with database', async () => {
    const res = await request(server).post('/v1/auth/reset')
      .send({
        userId:2,
        password:'hello123@',
        token:"375a19ea-d382-48c4-aa87-d191009e581d"
      })
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual(Message.token_expired);
  });

  it('check userId is wrong with database', async () => {
    const res = await request(server).post('/v1/auth/reset')
      .send({
        userId:4,
        password:'hello123@',
        token:"375a19ea-d382-48c4-aa87-d191009e581d"
      })
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual(Message.token_expired);
  });

});