import express from 'express';
import authSchema from '../validations/auth.validation';
import validation from '../middlewares/validation.middleware';
import * as authController from '../controllers/auth.controller';
const router = express.Router();
const {
    signInSchema,
    signUpSchema
} = authSchema;
router.post('/sign-in', validation(signInSchema), authController.signIn);
router.post('/sign-up', validation(signUpSchema), authController.signUp);
export default router;
