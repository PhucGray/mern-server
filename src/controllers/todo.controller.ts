import { Response, Request } from 'express';
import Todo from '../models/todo.model';
import User from '../models/user.model';

export const getAllTodo = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.userId);

        res.status(200).json({
            success: true,
            data: {
                todos: user?.todos,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error,
        });
    }
};
export const addTodo = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.userId);
        const { content } = req.body;

        if (!content)
            return res.status(400).json({
                success: false,
                message: 'Please enter a todo content',
            });

        const newTodo = new Todo({ content, isCompleted: false });

        await user?.updateOne({
            $push: { todos: newTodo },
        });

        res.status(200).json({
            success: true,
            data: {
                todoId: newTodo.id,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error,
        });
    }
};
export const deleteTodo = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.userId);

        const { todoId } = req.params;

        if (!todoId)
            return res.status(400).json({
                success: false,
                message: 'Not Todo Id Provided',
            });

        await user?.updateOne({
            $pull: { todos: { _id: todoId } },
        });

        res.status(200).json({
            success: true,
            message: 'Delete todo successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error,
        });
    }
};
export const updateTodoContent = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.userId);
        const { content } = req.body;
        const { todoId } = req.params;

        if (!content)
            return res.status(400).json({
                success: false,
                message: 'Please enter a todo content',
            });

        const newTodos = user?.todos.map((todo) => {
            if (todo._id.toString() === todoId) {
                todo.content = content;
            }

            return todo;
        });

        await user?.updateOne({
            $set: { todos: newTodos },
        });

        res.status(200).json({
            success: true,
            message: 'Edit content successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error,
        });
    }
};
export const updateTodoState = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.userId);
        const { todoId } = req.params;

        const newTodos = user?.todos.map((todo) => {
            if (todo._id.toString() === todoId) {
                todo.isCompleted = !todo.isCompleted;
            }

            return todo;
        });

        await user?.updateOne({
            $set: { todos: newTodos },
        });

        res.status(200).json({
            success: true,
            message: 'Edit state successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error,
        });
    }
};
