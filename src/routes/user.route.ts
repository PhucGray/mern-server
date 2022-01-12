import { Router } from 'express';
import {
    refreshToken,
    resetPassword,
    signIn,
    signUp,
} from '../controllers/user.controller';

const router = Router();

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);

export default router;
