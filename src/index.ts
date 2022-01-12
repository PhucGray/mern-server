import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.route';
import todoRoutes from './routes/todo.route';
import mongoose from 'mongoose';
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.DB_CONNECT || '', () => {
    console.log('connected to db');
});

app.get('/', (req, res) => res.send('Hello'));

app.use('/user', userRoutes);
app.use('/todo', todoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
