import 'dotenv/config';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthErrorType, TokenPayloadType } from '../types';

export const verifyTokenMiddleware = async (
    req: any,
    res: Response,
    next: NextFunction,
) => {
    // get token from client request
    let token = '';
    const secretKey = process.env.TOKEN_SECRET;

    try {
        token = req.headers.authorization.split(' ')[1];
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'No Token Provided',
            type: 'token',
        } as AuthErrorType);
    }

    if (!secretKey)
        return res.status(400).json({
            success: false,
            message: 'No Secret key Provided',
            type: 'server',
        } as AuthErrorType);

    try {
        const decode = jwt.verify(token, secretKey) as TokenPayloadType;

        req.userId = decode.userId;

        next();
    } catch (error) {
        console.log('$$$$Middleware$$$$: ' + error);

        res.status(401).json({
            success: false,
            message: error,
            type: 'token',
        } as AuthErrorType);
    }
};
