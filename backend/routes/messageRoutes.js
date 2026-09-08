import express from 'express';
import {
  getMessages,
  getMessageContext,
  getStats,
} from '../controllers/messageController.js';

const router = express.Router();

router.get('/', getMessages);
router.get('/stats', getStats);
router.get('/:id/context', getMessageContext);

export default router;
