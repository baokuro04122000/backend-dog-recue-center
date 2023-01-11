import { ErrorResponse } from '../types/common.type';
export const errorResponse = ({error, status}: {error: string, status: number}): ErrorResponse => {
    return {
        status,
        errors:{
            message: error
        }
    };
};
