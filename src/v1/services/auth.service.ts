import bcrypt from 'bcrypt';
import usersModel from '../models/users.mysql.model';
import {
  errorResponse
} from '../utils/error.util';
import {
  IUserSignInPayload,
  UserSignInBody,
  UserSignUpBody,
} from '../types/user.type';
import {
  INotifyPayload
} from '../types/generic.type';
import {
  generateToken
} from '../middlewares/token.middleware';
import * as Message from '../lang/en.lang';

import logger from '../core/loggers';

require('dotenv-safe').config();
import {
  errorResponse
} from '../utils/error.util';

import {
  IUserSignInPayload,
  UserSignInBody,
  UserSignUpBody,
} from '../types/user.type';
import {
  INotifyPayload
} from '../types/generic.type';

import * as Message from '../lang/en.lang';

import logger from '../core/loggers';
require('dotenv-safe').config();

export const signIn = ({
    email,
    password
  }:UserSignInBody ): Promise<IUserSignInPayload> => new Promise(async (resolve, reject) => {
    try {
      const account = await usersModel.findOne({
        where:{
          email
        }
      });

      if(!account) {
        return reject(errorResponse({
          error: Message.default.email_not_exists,
          status: 403
        }));
      }

      if(!account.active) { return reject(errorResponse({
        error: Message.default.email_not_active,
        status: 403
      }));
      }

      const checkPass = await bcrypt.compare(password, account.password);
      if(!checkPass) {
        return reject(errorResponse({
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
    // do some thing
    return resolve({
      message: Message.default.sign_up_success,
      status:200,
      
    });

  } catch (error) {
    logger.error(JSON.stringify(error));
    return reject(errorResponse({
      error: Message.default.INTERNAL_SERVER_ERROR,
      status: 500
    }));
  }
});
