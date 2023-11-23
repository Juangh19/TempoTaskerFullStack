import { NotFoundError } from '../errors/customErrors.js';
import Task from '../models/TaskModel.js';
import { StatusCodes } from 'http-status-codes';

export const getTasks = async (req, res) => {
  const userID = req.user.userID;
  const { search, status } = req.query;

  const queryObject = {
    createdBy: userID,
  };

  if (status) {
    queryObject.status = status;
  }
  if (search) {
    queryObject.name = { $regex: search, $options: 'i' };
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const tasks = await Task.find(queryObject).skip(skip).limit(limit);
  const totalTasks = await Task.countDocuments(queryObject);

  res.status(StatusCodes.OK).json({ tasks, totalTasks });
};

export const createTask = async (req, res) => {
  const { name, duration } = req.body;
  const userID = req.user.userID;

  const task = await Task.create({ name, duration, createdBy: userID });
  res.status(StatusCodes.CREATED).json({ msg: 'Task created', task });
};

export const getTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new NotFoundError('Task not found');
  res.status(StatusCodes.OK).json({ task });
};

export const updateTask = async (req, res) => {
  const { name, duration, status } = req.body;
  const statusUpdate = status ? status : 'todo';
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { name, duration, status: statusUpdate },
    { new: true }
  );
  if (!task) throw new NotFoundError('Task not found');
  res.status(StatusCodes.OK).json({ msg: 'Task updated', task: task });
};

export const deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) throw new NotFoundError('Task not found');
  res.status(StatusCodes.OK).json({ msg: 'Task deleted', task });
};
