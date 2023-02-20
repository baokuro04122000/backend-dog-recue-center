import {Response, Request, RequestHandler} from 'express';
import * as dogService from '../services/dogs.service';
import filter from 'validator';
import {
    ErrorResponse
} from '../types/common.type';
import Message from '../lang/en.lang';
import logger from '../core/loggers';


export const create:RequestHandler = async (req: Request, res: Response) => {
  const {
    name,
    title,
    breed,
    hobbies,
    avatar,
    address,
    age,
    about,
    city
  } = req.body;
  try {
    const payload = await dogService.create({
      name: filter.escape(name),
      about: filter.escape(about),
      title: filter.escape(title),
      breed: filter.escape(breed),
      hobbies: filter.escape(hobbies),
      avatar: avatar,
      address: filter.escape(address),
      age: filter.escape(age),
      city: filter.escape(city),
      userId: Number(req.user?.id)
    });

    return res.status(200).json(payload);
  } catch (error) {
    const err = error as ErrorResponse;
    return res.status(err.status).json(err);
  }
};

export const edit:RequestHandler = async (req: Request, res: Response) => {
  const {
    name,
    title,
    breed,
    hobbies,
    avatar,
    address,
    age,
    about,
    city,
    id
  } = req.body;

  try {
    const payload = await dogService.edit({
      name: filter.escape(name),
      about: filter.escape(about),
      title: filter.escape(title),
      breed: filter.escape(breed),
      hobbies: filter.escape(hobbies),
      avatar: avatar,
      address: filter.escape(address),
      age: filter.escape(age),
      city: filter.escape(city),
      id: id,
      userId: Number(req?.user?.id)
    });
    return res.status(200).json(payload);
  } catch (error) {
    const err = error as ErrorResponse;
    return res.status(err.status).json(err);
  }
};

export const get:RequestHandler = async (req: Request, res: Response) => {
  const {
    id
  } = req.query;

  if(!id){
    return res.status(400).json({
      status: 400,
      errors:{
        message: Message.id_empty
      }
    });
  }

  if(!filter.isNumeric(""+id)) { return res.status(400).json({
    status: 400,
    errors:{
      message: Message.id_invalid
    }
    });
  }

  try {
    const payload = await dogService.get({
     id: Number(id)
    });
    return res.status(200).json(payload);
  } catch (error) {
    const err = error as ErrorResponse;
    return res.status(err.status).json(err);
  }
};

export const search:RequestHandler = async (req: Request, res: Response) => {

  try {
    const payload = await dogService.search(req);
    return res.status(200).json(payload);
  } catch (error) {
    const err = error as ErrorResponse;
    return res.status(err.status).json(err);
  }
};