import { Router } from 'express';
import { getCurrentUser } from '../controllers/userController.js';
const router = Router();

router.route('/current-user').get(getCurrentUser);

export default router;
