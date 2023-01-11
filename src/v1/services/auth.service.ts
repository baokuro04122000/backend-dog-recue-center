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

import * as Message from '../lang/en.lang';

import logger from '../core/loggers';
require('dotenv-safe').config();

export const signIn = ({
    email,
    password
  }:UserSignInBody ): Promise<IUserSignInPayload> => new Promise(async (resolve, reject) => {
    try {
      //do some thing
      const payload:any = {}
      
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
