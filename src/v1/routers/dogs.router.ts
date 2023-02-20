import express from 'express';
import dogsSchema from '../validations/dogs.validation';
import validation from '../middlewares/validation.middleware';
import {isAuth} from '../middlewares/token.middleware';
import * as dogController from '../controllers/dogs.controller';
const router = express.Router();
const {
    createDogSchema
} = dogsSchema;
router.post('/breed/add', isAuth, validation(createDogSchema), dogController.create);
router.put('/breed/edit', isAuth, validation(createDogSchema), dogController.edit)
router.get('/breed/get', dogController.get)
router.get('/breeds/list', dogController.search)
export default router;
