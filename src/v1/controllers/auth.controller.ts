import {Response, Request, RequestHandler} from 'express';
import * as authService from '../services/auth.service';
import {
    ErrorResponse
} from '../types/common.type';
import logger from '../core/loggers';
import redis from '../databases/init.redis';


export const signIn:RequestHandler = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try {
        const payload = await authService.signIn({email, password});
        redis.set(payload.id + '_token', payload.token, (done) => {
            logger.info('redis set token:::', done);
        });
        redis.set(payload.id + '_refreshtoken', payload.refreshToken, (done) => {
            logger.info('redis set refresh token:::', done);
        });
        return res.status(200).json(payload);
    } catch (error) {
        const err = error as ErrorResponse;
        return res.status(err.status).json(err);
    }
};

export const signUp: RequestHandler = async (req: Request, res: Response) => {
    //do something
    return res.status(200).json('do something');
};
