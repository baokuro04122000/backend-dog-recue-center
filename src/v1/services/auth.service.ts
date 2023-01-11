import usersModel from '../models/users.mysql.model';
import tokenModel from '../models/token.mysql.model';
import sequelize,{Op} from 'sequelize';
import {
  errorResponse
} from '../utils/error.util';
import bcrypt from 'bcrypt';
import {
  IUserSignInPayload,
  UserSignInBody,
  UserSignUpBody,
  ActiveAccountBody
} from '../types/user.type';
import {
  INotifyPayload
} from '../types/generic.type';
import {
  generateToken
} from '../middlewares/token.middleware';
import * as Message from '../lang/en.lang';
import redis from '../databases/init.redis';
import logger from '../core/loggers';
import crypto from 'crypto';

require('dotenv-safe').config();

export const signIn = ({
    email,
    password
  }:UserSignInBody ): Promise<IUserSignInPayload> => new Promise(async (resolve, reject) => {
    try {
      const account = await usersModel.findOne({
        where:{
          email
        },
        raw: true
      });

      if(!account) { return reject(errorResponse({
        error: Message.default.email_not_exists,
        status: 400
      }));
      }

      if(!account.active) {  return reject(errorResponse({
        error: Message.default.email_not_active,
        status: 400
      }));
      }

      const checkPass = await bcrypt.compare(password, account.password);
      if(!checkPass) { return reject(errorResponse({
        error: Message.default.wrong_password,
        status: 403
      }));
      }

      const payload: IUserSignInPayload = {
        id: account.id,
        name: account.name,
        email: account.email,
        avatar: account.avatar,
        active: account.active,
        token: await generateToken({
          id: account.id,
          name: account.name,
          email: account.email,
          avatar: account.avatar
        },{
          expiresIn: '1h',
          algorithm: 'RS256'
        }),
        refreshToken: await generateToken({
          id: account.id,
          name: account.name,
          email: account.email,
          avatar: account.avatar
        }, {
          expiresIn: '7d',
          algorithm: 'RS256'
        })
      };
      return resolve(payload);
    } catch (error) {
      logger.error(JSON.stringify(error));
      return reject(errorResponse({
        error: Message.default.INTERNAL_SERVER_ERROR,
        status: 500
      }));
    }
});

export const signUp = ({
  email,
  password,
  name,
  avatar
}: UserSignUpBody): Promise<INotifyPayload<any>> => new Promise(async (resolve, reject) => {
  try {
    const account = await usersModel.findOne({
      where:{
        email
      },
      attributes:['email'],
      raw: true
    });

    if(account) { return reject(errorResponse({
      error: Message.default.email_exists,
      status:400
    }));
    }

    const hashPassword = await bcrypt.hash(password, process.env.SALT_HASH_PASSWORD || 10 );
    const user = await usersModel.create({
      email,
      password: hashPassword,
      name,
      avatar
    });
    const token = crypto.randomUUID();
    await tokenModel.create({
      token,
      userId: user.id
    });

    redis.publish('send-email-active-account', JSON.stringify({
      userId: user.id,
      email,
      name,
      verifyToken:token
    }), (err, ok) => logger.info(`send email active account::: ${ok}`));

    return resolve({
      message: Message.default.sign_up_success,
      status:200,
      data: user
    });

  } catch (error) {
    logger.error(JSON.stringify(error));
    return reject(errorResponse({
      error: Message.default.INTERNAL_SERVER_ERROR,
      status: 500
    }));
  }
});

export const activeAccount = ({token, userId}: ActiveAccountBody): Promise<INotifyPayload<any>> => new Promise(async (resolve, reject) => {
  try {
    const tokenValid = await tokenModel.findOne({
      where : {
        token,
        userId,
        expiration: {
          [Op.gte]: sequelize.fn('NOW')
        }
      }
    });

    if(!tokenValid) return reject(errorResponse({
      error: Message.default.token_expired,
      status: 400
    }))

    await usersModel.update({
      active: true
    }, {
      where:{
        id: userId
      }
    })

    tokenValid.destroy()
    .then(() => logger.info('delete token active account success'))
    .catch((err) => logger.error(JSON.stringify(err)))
    
    return resolve({
      message: Message.default.active_account_success,
      status:200,
      data: tokenValid
    });
  } catch (error) {
    logger.error('active account error::', JSON.stringify(error));
    return reject(errorResponse({
      error: Message.default.INTERNAL_SERVER_ERROR,
      status: 500
    }));
  }
});
