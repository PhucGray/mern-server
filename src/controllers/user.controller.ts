import { Response, Request } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import { getToken, getTokenAndRefreshToken } from '../utils/token';
import { hashPassword } from '../utils/bcrypt';
import { AuthErrorType, AuthResType, TokenPayloadType } from '../types';
import jwt from 'jsonwebtoken';

export const signUp = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check: empty email or password
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Please enter you email',
            type: 'email',
        } as AuthErrorType);
    }
    if (!password) {
        return res.status(400).json({
            success: false,
            message: 'Please enter you password',
            type: 'password',
        } as AuthErrorType);
    }

    try {
        // Check if email exists
        const user = await User.findOne({ email });

        if (user)
            return res.status(409).json({
                success: false,
                message: 'Email already exists',
                type: 'email',
            } as AuthErrorType);

        // All good
        const hashedPassword = await hashPassword(password);

        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        if (newUser.id) {
            const payload = { userId: newUser.id } as TokenPayloadType;
            const tokens = getTokenAndRefreshToken(payload);

            return res.status(201).json({
                success: true,
                message: 'Sign up successfully',
                data: tokens,
            } as AuthResType);
        }
    } catch (error) {
        console.log('sign-up: ' + error);
        res.status(500).json({
            success: false,
            message: error,
            type: 'server',
        } as AuthErrorType);
    }
};
export const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check: empty email or password
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Please enter you email',
            type: 'email',
        } as AuthErrorType);
    }
    if (!password) {
        return res.status(400).json({
            success: false,
            message: 'Please enter you password',
            type: 'password',
        } as AuthErrorType);
    }

    try {
        // Check if email exists
        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).json({
                success: false,
                message: 'Incorect email or password',
                type: 'password',
            } as AuthErrorType);

        // Check password

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect)
            return res.status(400).json({
                success: false,
                message: 'Incorect email or password',
                type: 'password',
            } as AuthErrorType);

        // All good
        const payload = { userId: user.id } as TokenPayloadType;
        const tokens = getTokenAndRefreshToken(payload);

        return res.status(200).json({
            success: true,
            message: 'Sign in successfully',
            data: tokens,
        } as AuthResType);
    } catch (error) {
        console.log('sign-in: ' + error);
        res.status(500).json({
            success: false,
            message: error,
            type: 'server',
        } as AuthErrorType);
    }
};
export const resetPassword = async (req: Request, res: Response) => {
    const { email, oldPassword, newPassword } = req.body;

    // Check: empty email or password
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Please enter you email',
            type: 'email',
        } as AuthErrorType);
    }
    if (!oldPassword) {
        return res.status(400).json({
            success: false,
            message: 'Please enter you password',
            type: 'password',
        } as AuthErrorType);
    }
    if (!newPassword) {
        return res.status(400).json({
            success: false,
            message: 'Please enter you confirm password',
            type: 'confirmPassword',
        } as AuthErrorType);
    }

    try {
        // Check if email exists
        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).json({
                success: false,
                message: 'Incorect email address',
                type: 'email',
            } as AuthErrorType);

        // Check password

        const isPasswordCorrect = await bcrypt.compare(
            oldPassword,
            user.password,
        );

        if (!isPasswordCorrect)
            return res.status(400).json({
                success: false,
                message: 'Incorect password',
                type: 'password',
            } as AuthErrorType);

        const newHashedPassword = await hashPassword(newPassword);

        await user.updateOne({ password: newHashedPassword });

        // All good

        return res.status(200).json({
            success: true,
            message: 'Reset password successfully',
        } as AuthResType);
    } catch (error) {
        console.log('sign-in: ' + error);
        res.status(500).json({
            success: false,
            message: error,
            type: 'server',
        } as AuthErrorType);
    }
};
export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken)
            return res.status(400).json({
                success: false,
                message: 'No refresh token provided.',
                type: 'refreshToken',
            } as AuthErrorType);

        const secretKey = process.env.REFRESH_SECRET;

        if (!secretKey)
            return res.status(500).json({
                success: false,
                message: 'No Secret key Provided',
                type: 'server',
            } as AuthErrorType);

        const decode = jwt.verify(refreshToken, secretKey) as TokenPayloadType;

        const payload = { userId: decode.userId } as TokenPayloadType;

        const token = getToken(payload);

        res.status(200).json({
            success: true,
            message: 'Refresh token sent',
            data: { token },
        } as AuthResType);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error,
            type: 'server',
        } as AuthErrorType);
    }
};
