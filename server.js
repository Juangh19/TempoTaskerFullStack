import 'express-async-errors';
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import path, { dirname } from 'path';

import authRouter from './routes/authRouter.js';
import taskRouter from './routes/taskRouter.js';
import userRouter from './routes/userRouter.js';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware.js';
import { authenticateUser } from './middlewares/authMiddleware.js';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(path.resolve(__dirname, './client/dist')));

app.use(express.json());
app.use(cookieParser());

app.get('/api/v1/test', async (req, res) => {
  res.status(200).json({ msg: 'test' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tasks', authenticateUser, taskRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
//add task route

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'not found' });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGO_URI);
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
