import * as yup from 'yup';
import Message from '../lang/en.lang';
const dogValidation = {
  createDogSchema: yup.object({
    name: yup.string()
    .required()
    .min(2, Message.name_min_length)
    .max(50, Message.name_max_length),
    title: yup.string()
    .required()
    .min(10)
    .max(100),
    breed: yup.string()
    .required()
    .min(2)
    .max(30),
    hobbies: yup.string()
    .required()
    .min(2)
    .max(150),
    avatar: yup.string()
    .required()
    .min(50)
    .max(150),
    address: yup.string()
    .required()
    .min(2)
    .max(100),
    age: yup.string()
    .required()
    .min(1)
    .max(5),
    about: yup.string()
    .required()
    .min(2)
    .max(150),
    city: yup.string()
    .required()
    .min(2)
    .max(20)
  })
};
export default dogValidation;
