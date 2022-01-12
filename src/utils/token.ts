import jwt from 'jsonwebtoken';

export const getToken = (payload: any) => {
    const secretKey = process.env.TOKEN_SECRET;
    const tokenLife = process.env.TOKEN_LIFE;

    if (!secretKey || !tokenLife) return;

    const token = jwt.sign(payload, secretKey, { expiresIn: tokenLife });

    return token;
};

export const getTokenAndRefreshToken = (payload: any) => {
    const secretKey = process.env.TOKEN_SECRET;
    const refreshKey = process.env.REFRESH_SECRET;
    const tokenLife = process.env.TOKEN_LIFE;
    const refreshLife = process.env.REFRESH_LIFE;

    if (!secretKey || !tokenLife || !refreshKey || !refreshLife) return;

    const token = jwt.sign(payload, secretKey, { expiresIn: tokenLife });
    const refreshToken = jwt.sign(payload, refreshKey, {
        expiresIn: refreshLife,
    });

    const data = { token, refreshToken };

    return data;
};
