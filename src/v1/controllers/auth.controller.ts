import {Response, Request, RequestHandler} from 'express';
import * as authService from '../services/auth.service';

export const signIn:RequestHandler = async (req: Request, res: Response) => {
    //do some thing
    return res.status(200).json('api sign in');
};

export const signUp: RequestHandler = async (req: Request, res: Response) => {
    //do something
    return res.status(200).json('do something');
};
