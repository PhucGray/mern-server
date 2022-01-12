import { Router } from 'express';
import {
    addTodo,
    deleteTodo,
    getAllTodo,
    updateTodoContent,
    updateTodoState,
} from '../controllers/todo.controller';
import { verifyTokenMiddleware as tokenMiddleware } from '../middlewares/token.middleware';

const router = Router();

router.get('/', tokenMiddleware, getAllTodo);
router.post('/', tokenMiddleware, addTodo);
router.delete('/:todoId', tokenMiddleware, deleteTodo);
router.put('/content/:todoId', tokenMiddleware, updateTodoContent);
router.put('/state/:todoId', tokenMiddleware, updateTodoState);

export default router;
