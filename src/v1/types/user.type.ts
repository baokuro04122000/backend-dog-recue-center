export interface IUserSignInPayload {
    id: number;
    email: string;
    name: string;
    avatar: string;
    active: boolean;
    token: string;
    refreshToken: string;
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
