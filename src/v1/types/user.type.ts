export interface IUserSignInPayload {
    id: number;
    email: string;
    name: string;
    avatar: string;
    active: boolean;
    token: string;
    refreshToken: string;
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

export interface IUserSignUpPayload {
    id: number;
    email: string;
    name: string;
    avatar: string;
    active: boolean;
    token: string;
    refreshToken: string;
}
