import usersModel from '../models/users.mysql.model';
import dogModel from '../models/dogs.mysql.model';
import { Request } from 'express';
import {
  errorResponse
} from '../utils/error.util';
import {
  DogBodyRequest,
  DetailsDogPayload
} from '../types/dogs.type'
import {
  INotifyPayload
} from '../types/generic.type';
import APIFeatures from '../utils/apiFeatures.util';
import Message from '../lang/en.lang';
import logger from '../core/loggers';


require('dotenv-safe').config();

type EditDogBodyRequest = Partial<DogBodyRequest>
& { id: number, userId: number }

export const create = (dog:DogBodyRequest ): Promise<INotifyPayload<null>> => new Promise(async (resolve, reject) => {
    try {
      const created = await dogModel.create(dog)
      console.log(created)
      return resolve({
        status: 200,
        message: Message.create_dog_success,
        data: null
      });
    } catch (error) {
      logger.error(JSON.stringify(error));
      return reject(errorResponse({
        error: Message.INTERNAL_SERVER_ERROR,
        status: 500
      }));
    }
});

export const edit = (dog:EditDogBodyRequest ): Promise<INotifyPayload<null>> => new Promise(async (resolve, reject) => {
  try {
    await dogModel.update({
      name: dog.name,
      title: dog.title,
      breed: dog.breed,
      hobbies: dog.hobbies,
      avatar: dog.avatar,
      address: dog.address,
      age: dog.age,
      about: dog.about,
      city: dog.city
    },{
      where:{
        id: dog.id,
        userId: dog.userId
      }
    })
    return resolve({
      status: 200,
      message: Message.update_dog_success,
      data: null
    });
  } catch (error) {
    logger.error(JSON.stringify(error));
    return reject(errorResponse({
      error: Message.INTERNAL_SERVER_ERROR,
      status: 500
    }));
  }
});

export const get = ({id}: {id: number}): Promise<INotifyPayload<any>> => new Promise(async (resolve, reject) => {
  try {
    const dog = await dogModel.findOne({
      where: {
        id
      },
      include:[{model: usersModel, as: 'user', attributes: ['name', 'phone', 'address']}],
      raw: true
    })
    if(!dog) {
      return reject(errorResponse({error:Message.dog_not_found, status: 404}))
    }
    
    const payload: DetailsDogPayload = {
      ...dog,
      contact:{
        name: dog['user.name'],
        address: dog['user.address'],
        phone: dog['user.phone']
      }
    }

    return resolve({
      status: 200,
      data: payload
    });
  } catch (error) {
    console.log(error)
    logger.error(JSON.stringify(error));
    return reject(errorResponse({
      error: Message.INTERNAL_SERVER_ERROR,
      status: 500
    }));
  }
});

export const search = (req: Request): Promise<INotifyPayload<any>> => new Promise(async (resolve, reject) => {
  try {
    const api = new APIFeatures({}, req);
    api.search().pagination()
    const dogs = await dogModel.findAll({
      ...api.query,
      raw: true
    })

    if(!dogs) {
      return reject(errorResponse({error:Message.dog_not_found, status: 404}))
    }
    
    return resolve({
      status: 200,
      data: dogs
    });
  } catch (error) {
    console.log(error)
    logger.error(JSON.stringify(error));
    return reject(errorResponse({
      error: Message.INTERNAL_SERVER_ERROR,
      status: 500
    }));
  }
});