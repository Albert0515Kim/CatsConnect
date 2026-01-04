import express from 'express';
import {
  listConversations,
  listMessages,
  sendMessage,
  startConversation,
} from '../controllers/messagesController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/conversations', requireAuth, listConversations);
router.post('/conversations', requireAuth, startConversation);
router.get('/conversations/:conversationId/messages', requireAuth, listMessages);
router.post('/conversations/:conversationId/messages', requireAuth, sendMessage);

export default router;
