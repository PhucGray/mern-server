import { ObjectId } from 'mongoose';

export type UserType = {
    email: string;
    password: string;
    todos: TodoType[];
};

export type TodoType = {
    _id: ObjectId;
    content: string;
    isCompleted: boolean;
};

export type TokenPayloadType = {
    userId: string;
};

export type AuthErrorType = {
    success: false;
    message: string | any;
    type:
        | 'email'
        | 'password'
        | 'confirmPassword'
        | 'token'
        | 'refreshToken'
        | 'server';
};

export type AuthResType = {
    success: true;
    message: string;
    data: {
        token: string;
        refreshToken: string;
    };
};
