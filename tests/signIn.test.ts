import request from 'supertest';
import Message from '../src/v1/lang/en.lang'
import server from '../src/server';

describe('API Sign In Endpoints', () => {
  it('check password is required', async () => {
    const res = await request(server).post('/v1/auth/sign-in')
      .send({
        email:"bao"
      })
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual("password is a required field");
  });

  it('check email is required', async () => {
    const res = await request(server).post('/v1/auth/sign-in')
      .send({
        password:"hello123@"
      })
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual("email is a required field");
  });

  it('check email is invalid', async () => {
    const res = await request(server).post('/v1/auth/sign-in')
      .send({
        email:"bao",
        password:"hello123@"
      })
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual("email must be a valid email");
  });

  it('check password is invalid', async () => {
    const res = await request(server).post('/v1/auth/sign-in')
      .send({
        email:"bao@gmail.com",
        password:"hello"
      })
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual(Message.password_invalid);
  });

  it('check email not exists', async () => {
    const res = await request(server).post('/v1/auth/sign-in')
      .send({
        email:"bao@gmail.com",
        password:"hello123@"
      })
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual(Message.email_not_exists);
  });

  it('check email not active', async () => {
    const res = await request(server).post('/v1/auth/sign-in')
      .send({
        email:"baotrandinh100@gmail.com",
        password:"hello123@"
      })
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual(Message.email_not_active);
  });

  it('check wrong password', async () => {
    const email = "baotrandinh.ute@gmail.com"
    const res = await request(server).post('/v1/auth/sign-in')
      .send({
        email,
        password:"hello124@"
      })
    
    expect(res.status).toEqual(403); // success
    expect(res.body.errors.message).toEqual(Message.wrong_password);
  });

  it('check login success email matching', async () => {
    const email = "baotrandinh.ute@gmail.com"
    const res = await request(server).post('/v1/auth/sign-in')
      .send({
        email,
        password:"hello123@"
      })
    
    expect(res.status).toEqual(200); // success
    expect(res.body.data.email).toEqual(email);
  });
});