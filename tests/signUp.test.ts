import request from 'supertest';
import Message from '../src/v1/lang/en.lang'
import userModel from '../src/v1/models/users.mysql.model'
import tokenModel from '../src/v1/models/token.mysql.model'
import server from '../src/server';

describe('API Sign Up Endpoints', () => {

  it('check name is required', async () => {
    const res = await request(server).post('/v1/auth/sign-up')
      .send({
        email:"bao",
        password:"hello123@"
      })
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual("name is a required field");
  });

  it('check password is required', async () => {
    const res = await request(server).post('/v1/auth/sign-up')
      .send({
        name:"bao",
        email:"baotrandinh100@gmail.com"
      })
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual("password is a required field");
  });

  it('check email is required', async () => {
    const res = await request(server).post('/v1/auth/sign-up')
      .send({
        name:"bao tran",
        password:"hello123@"
      })
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual("email is a required field");
  });

  it('check email is invalid', async () => {
    const res = await request(server).post('/v1/auth/sign-up')
      .send({
        email:"bao",
        password:"hello123@",
        name:'baotran'
      })
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual("email must be a valid email");
  });

  it('check password is invalid', async () => {
    const res = await request(server).post('/v1/auth/sign-up')
      .send({
        email:"bao@gmail.com",
        password:"hello",
        name:"bao tran"
      })
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual(Message.password_invalid);
  });

  it('check name at least 2 characters', async () => {
    const res = await request(server).post('/v1/auth/sign-up')
      .send({
        email:"bao@gmail.com",
        password:"hello123@",
        name:'a'
      })
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual(Message.name_min_length);
  });

  it('check name must be less than 50 characters', async () => {
    const res = await request(server).post('/v1/auth/sign-up')
      .send({
        email:"bao@gmail.com",
        password:"hello123@",
        name:'a'.repeat(51)
      })
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual(Message.name_max_length);
  });

  it('check email already exists', async () => {
    const res = await request(server).post('/v1/auth/sign-up')
      .send({
        email:"baotrandinh.ute@gmail.com",
        password:"hello123@",
        name:'bao tran'
      })
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual(Message.email_exists);
  });

  it('check email not active', async () => {
    const res = await request(server).post('/v1/auth/sign-up')
      .send({
        email:"baotrandinh100@gmail.com",
        password:"hello123@",
        name:"bao tran"
      })
    
    expect(res.body.status).toEqual(400); // bad request
    expect(res.body.errors.message).toEqual(Message.email_exists);
  });

  it('check sign up success', async () => {
    const res = await request(server).post('/v1/auth/sign-up')
      .send({
        email:"bao@gmail.com",
        password:"hello123@",
        name:"bao tran"
      })
    
    expect(res.body.status).toEqual(200); // success
    expect(res.body.message).toEqual(Message.sign_up_success);
    
    const user: any = await userModel.findOne({
      where:{
        email:"bao@gmail.com"
      },
      attributes:['email'],
      raw: true
    })

    userModel.destroy({
      where:{
        email: "bao@gmail.com"
      }
    }).then()
    .catch((error) => {
      console.log(error)
    })

    tokenModel.destroy({
      where:{
        userId: user.id
      }
    }).then()
    .catch((error) => console.log(error))
  });

});