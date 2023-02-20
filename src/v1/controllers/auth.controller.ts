import {Response, Request, RequestHandler} from 'express';
import * as authService from '../services/auth.service';
import filter from 'validator';
import {
    ErrorResponse
} from '../types/common.type';
import Message from '../lang/en.lang';
import logger from '../core/loggers';
import redis from '../databases/init.redis';

export const signIn:RequestHandler = async (req: Request, res: Response) => {
  const {email, password} = req.body;
  try {
    const payload = await authService.signIn({email: filter.escape(email), password: filter.escape(password)});
    redis.set(payload.data.id + '_token', payload.accessToken, 'EX', Number(process.env.ACCESS_TOKEN_REDIS_EXPIRED), (done) => {
        logger.info('redis set token:::', done);
    });
    redis.set(payload.data.id + '_refreshtoken', payload.refreshToken,'EX', Number(process.env.REFRESH_TOKEN_REDIS_EXPIRED), (done) => {
        logger.info('redis set refresh token:::', done);
    });
    console.log('payload:::', payload)
    return res.status(200).json(payload);
  } catch (error) {
    const err = error as ErrorResponse;
    return res.status(err.status).json(err);
  }
};

export const signUp: RequestHandler = async (req: Request, res: Response) => {
    const {
      email,
      password,
      name,
      avatar
    } = req.body;

    try {
      const payload = await authService.signUp({
        email: filter.escape(email),
        password: filter.escape(password),
        name: filter.escape(name),
        avatar: avatar ? filter.escape(avatar) : ''
      });
      return res.status(payload.status).json(payload);
    } catch (error) {
      const err = error as ErrorResponse;
      return res.status(err.status).json(err);
    }
};

export const activeAccount: RequestHandler = async (req: Request, res: Response) => {
  const {token, userId} = req.query;
  if(!token || !userId) {return res.status(400).json({
    status: 400,
    errors:{
      message: Message.token_and_userId_required
    }
  })}

  if(!filter.isUUID(token.toString())) { return res.status(400).json({
    status: 400,
    errors:{
      message: Message.token_invalid
    }
  });
  }

  if(!filter.isNumeric(""+userId)) { return res.status(400).json({
    status: 400,
    errors:{
      message: Message.user_id_invalid
    }
  });
  }

  try {
    const payload = await authService.activeAccount({
      token: token as string,
      userId: Number(userId)
    });

    return res.status(payload.status).json(payload);
  } catch (error) {
    const err = error as ErrorResponse;
    return res.status(err.status).json(err);
  }

};

export const emailResetPassword: RequestHandler = async (req: Request, res: Response) => {
  const {email} = req.body;
  try {
    const payload = await authService.emailResetPassword(email)
    return res.status(payload.status).json(payload)
  } catch (error) {
    const err = error as ErrorResponse;
    return res.status(err.status).json(err);
  }
}

export const resetPassword: RequestHandler = async (req: Request, res: Response) => {
  const {token, userId, password} = req.body;
  
  if(!filter.isUUID(token as string)) { return res.status(400).json({
    status: 400,
    errors:{
      message: Message.token_invalid
    }
  });
  }
  
  if(!filter.isNumeric(""+userId)) { return res.status(400).json({
    status: 400,
    errors:{
      message: Message.user_id_invalid
    }
  });
  }
  
  try {
    const payload = await authService.resetPassword({
      token,
      userId,
      password
    })
    return res.status(payload.status).json(payload)
  } catch (error) {
    const err = error as ErrorResponse;
    return res.status(err.status).json(err);
  }
}

export const resendEmailActive: RequestHandler = async (req: Request, res: Response) => {
  const {email} = req.body;
  try {
    const payload = await authService.resendEmailActive(email);
    return res.status(payload.status).json(payload)
  } catch (error) {
    const err = error as ErrorResponse;
    return res.status(err.status).json(err);
  }
}
