import express from 'express';
import authSchema from '../validations/auth.validation';
import validation from '../middlewares/validation.middleware';
import * as authController from '../controllers/auth.controller';
const router = express.Router();
const {
    signInSchema,
    signUpSchema,
    userCheckEmailSchema,
    userResetPasswordSchema
} = authSchema;
router.post('/sign-in', validation(signInSchema), authController.signIn);
router.post('/sign-up', validation(signUpSchema), authController.signUp);
router.get('/active', authController.activeAccount);

router.post('/email-reset-password', validation(userCheckEmailSchema), authController.emailResetPassword)
router.post('/reset',validation(userResetPasswordSchema), authController.resetPassword)
router.post('/resend', validation(userCheckEmailSchema), authController.resendEmailActive)
export default router;
