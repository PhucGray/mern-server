import mongoose from 'mongoose';
import { TodoType } from '../types';

const todoSchema = new mongoose.Schema<TodoType>({
    content: {
        type: String,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        required: true,
    },
});

export default mongoose.model('Todo', todoSchema);
