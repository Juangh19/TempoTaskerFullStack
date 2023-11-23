import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from '../controllers/tasksController.js';
import {
  validateIDParam,
  validateTaskInput,
} from '../middlewares/validationMiddleware.js';
const router = Router();

router.route('/').get(getTasks).post(validateTaskInput, createTask);
router
  .route('/:id')
  .get(validateIDParam, getTask)
  .put(validateTaskInput, validateIDParam, updateTask)
  .delete(validateIDParam, deleteTask);

export default router;
