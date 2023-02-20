import {Response, Request, NextFunction} from 'express'
import Message from '../lang/en.lang'
import JWT from 'jsonwebtoken';
import {TokenPayload} from '../types/user.type'
import { errorResponse } from '../utils/error.util';
import redis from '../databases/init.redis';
import logger from '../core/loggers';

export const generateAccessToken = async (payload: object, options: JWT.SignOptions) => {
  console.log(process.env.ACCESS_TOKEN_SECRET)
  return await JWT.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET ? process.env.ACCESS_TOKEN_SECRET :'token-secret',
    options
  );
};

export const generateRefreshToken = async (payload: object, options: JWT.SignOptions) => {
  return await JWT.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET ? process.env.REFRESH_TOKEN_SECRET :'token-secret',
    options
  );
};

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if(authorization){
    const token = authorization.slice(7,authorization.length-1).trim(); //Bearer xxx
    JWT.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET ? process.env.ACCESS_TOKEN_SECRET :'token-secret',
      async (err,decode) => {    
        const payload = decode as TokenPayload
        if(err){
          if(err.name === "JsonWebTokenError"){
            return res.status(401).json(errorResponse({error:Message.token_invalid, status: 401}))
          }
          return res.status(401).json(errorResponse({error:Message.token_invalid, status: 401}))
        }
        try {
          const access_token = await  redis.get(payload.id+"_token")
          if(access_token !== token){
            logger.error("bad access")
            return res.status(401).json(errorResponse({error:Message.bad_access, status: 400}))
          }
          req.user = {
            id: payload.id,
            name: payload.name,
            email: payload.email,
            active: payload.active
          }
          return next()
        } catch (err) {
          logger.error("bad access")
          return res.status(401).json(errorResponse({error:Message.bad_access, status: 400}))
        }
      }
    );
  }else{
    res.status(404).json(errorResponse({error:Message.token_not_found, status: 404}));
  }
}
