import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a task name'],
      trim: true,
      maxlength: [20, 'Task name can not be more than 20 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'Please provide a duration'],
    },
    status: {
      type: String,
      enum: ['todo', 'doing', 'done'],
      default: 'todo',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Task', TaskSchema, 'tasks');
