export interface IUserSignInPayload {
    accessToken: string;
    refreshToken: string;
    data:{
        id: number;
        email: string;
        name: string;
        avatar: string;
    }
    active?: boolean;
}
export type UserSignInBody = {
    email: string;
    password: string;
}

export type UserSignUpBody = {
    email: string;
    name: string;
    avatar?: string;
    password: string;
}

export type ActiveAccountBody = {
    token: string,
    userId: number
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

export type ResetPasswordBody = Partial<ActiveAccountBody>
& { password: string }
