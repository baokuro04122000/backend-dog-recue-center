export interface IUserSignInPayload {
    accessToken: string;
    refreshToken: string;
    data:{
        id: number;
        email: string;
        name: string;
        avatar: string;
    };
    active?: boolean;
}
export interface UserSignInBody {
    email: string;
    password: string;
}

export interface UserSignUpBody {
    email: string;
    name: string;
    avatar?: string;
    password: string;
}

export interface ActiveAccountBody {
    token: string;
    userId: number;
}
export interface IUserSignUpPayload {
    id: number;
    email: string;
    name: string;
    avatar: string;
    active: boolean;
    token: string;
    refreshToken: string;
}

export type TokenPayload = {
    id: number,
    name: string,
    email: string,
    active: boolean
}

export type ResetPasswordBody = Partial<ActiveAccountBody>
& { password: string }
