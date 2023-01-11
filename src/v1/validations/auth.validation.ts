import * as yup from 'yup';
import Message from '../lang/en.lang';
const authValidation = {
    signInSchema: yup.object({
        email: yup.string()
        .required()
        .email(),
        password: yup.string()
        .required()
        .matches(/^(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,Message.password_invalid)
    }),
    signUpSchema: yup.object({
        email: yup.string()
        .required()
        .email(),
        password: yup.string()
        .required()
        .matches(/^(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,Message.password_invalid),
        name: yup.string()
        .required()
        .min(2, Message.name_min_length)
        .max(50, Message.name_min_length)
    })
};
export default authValidation;
