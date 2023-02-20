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
  ActiveAccountBody,
  ResetPasswordBody
} from '../types/user.type';
import {
  INotifyPayload
} from '../types/generic.type';
import {
  generateAccessToken,
  generateRefreshToken
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
        data:{
          id: account.id,
          name: account.name,
          email: account.email,
          avatar: account.avatar,

        },
        active: account.active,
        accessToken: await generateAccessToken({
          id: account.id,
          name: account.name,
          email: account.email,
          avatar: account.avatar,
          active: account.active
        },{
          expiresIn: process.env.TTL_ACCESS_TOKEN || '1h'
        }),
        refreshToken: await generateRefreshToken({
          id: account.id,
          name: account.name,
          email: account.email,
          avatar: account.avatar,
          active: account.active
        }, {
          expiresIn: process.env.TTL_REFRESH_TOKEN || '7d'
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

    const hashPassword = await bcrypt.hash(password, Number(process.env.SALT_HASH_PASSWORD || 10 ));
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
    console.log(error)
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

    if(!tokenValid) { return reject(errorResponse({
      error: Message.default.token_expired,
      status: 400
    }));
    }

    await usersModel.update({
      active: true
    }, {
      where:{
        id: userId
      }
    });

    tokenValid.destroy()
    .then(() => logger.info('delete token active account success'))
    .catch((err) => logger.error(JSON.stringify(err)));

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

export const emailResetPassword = (email: string): Promise<INotifyPayload<null>> => new Promise(async (resolve, reject) => {
  try {
    const user = await usersModel.findOne({
      where:{
        email
      },
      raw: true
    });

    if(!user) return reject(errorResponse({
      error: Message.default.email_not_exists,
      status: 400
    }))
    const token = crypto.randomUUID();

    if(!user.active) {
      return reject(errorResponse({
        error: Message.default.email_not_active,
        status: 403
      }))
    }

    // create token created before new one
    await tokenModel.destroy({
      where: {
        userId: user.id
      }
    })

    await tokenModel.create({
      token,
      userId: user.id
    });

    redis.publish('send-email-reset-password', JSON.stringify({
      userId: user.id,
      email,
      name:user.name,
      verifyToken:token
    }), (err, ok) => logger.info(`send email reset password::: ${ok}`));

    return resolve({
      message: Message.default.email_reset_password_success,
      status:200,
      data: null
    });
    
  } catch (error) {
    logger.error('active account error::', JSON.stringify(error));
    return reject(errorResponse({
      error: Message.default.INTERNAL_SERVER_ERROR,
      status: 500
    }));
  }
})

export const resetPassword = (
    { password, 
      token, 
      userId}: ResetPasswordBody
  ): Promise<INotifyPayload<null>> => new Promise(async (resolve, reject) => {
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

      const hashPassword = await bcrypt.hash(password, Number(process.env.SALT_HASH_PASSWORD || 10 ));
      await usersModel.update({
        password: hashPassword
      }, {
        where:{
          id: userId
        }
      })

      tokenValid.destroy()
      .then(() => logger.info('delete token reset password success'))
      .catch((err) => logger.error(JSON.stringify(err)))

      return resolve({
        message: Message.default.reset_password_success,
        status:200,
        data: null
      });
    } catch (error) {
      logger.error('reset password error::', JSON.stringify(error));
      return reject(errorResponse({
        error: Message.default.INTERNAL_SERVER_ERROR,
        status: 500
      }));
    }
})

export const resendEmailActive = (
  email: string
): Promise<INotifyPayload<null>> => new Promise(async (resolve, reject) => {
  try {
    const user = await usersModel.findOne({
      where:{
        email
      },
      raw: true
    });

    if(!user)  return reject(errorResponse({
      error: Message.default.email_not_exists,
      status: 400
    }));

    if(user.active)  return reject(errorResponse({
      error: Message.default.account_activated,
      status: 400
    }));

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
      message: Message.default.resend_email_active,
      status:200,
      data: null
    });
  
  } catch (error) {
    logger.error('reset password error::', JSON.stringify(error));
    return reject(errorResponse({
      error: Message.default.INTERNAL_SERVER_ERROR,
      status: 500
    }));
  }
})