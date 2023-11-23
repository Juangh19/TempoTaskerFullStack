import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from './models/UserModel.js';
import Task from './models/TaskModel.js';

try {
  await mongoose.connect(process.env.MONGO_URI);

  const tasks = JSON.parse(
    await readFile(new URL('./utils/MOCK_DATA.json', import.meta.url))
  );

  const testUser = await User.findOne({ email: 'juangarcia7337@gmail.com' });

  const testUserId = testUser._id;

  const newTasks = tasks.map((task) => {
    return { ...task, createdBy: testUserId };
  });

  await Task.deleteMany({ createdBy: testUserId });
  await Task.insertMany(newTasks);
  console.log('Data successfully imported!');
} catch (error) {
  console.log(error);
  process.exit(1);
}
