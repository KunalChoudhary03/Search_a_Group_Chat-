import express from 'express';
import { searchMessages } from '../controllers/searchController.js';

const router = express.Router();

// POST /api/search - Semantic search over group chat messages
router.post('/', searchMessages);

export default router;
