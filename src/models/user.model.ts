import mongoose from 'mongoose';
import { UserType } from '../types';

const userSchema = new mongoose.Schema<UserType>({
    email: {
        type: String,
        required: true,
        min: 11,
        max: 1024,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    todos: {
        type: [
            {
                content: {
                    type: String,
                    required: true,
                },
                isCompleted: {
                    type: Boolean,
                    required: true,
                },
            },
        ],
        required: false,
    },
});

export default mongoose.model('User', userSchema);
