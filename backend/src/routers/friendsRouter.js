import express from 'express';
import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  listFriendRequests,
  listFriends,
  removeFriend,
  sendFriendRequest,
} from '../controllers/friendsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, listFriends);
router.get('/requests', requireAuth, listFriendRequests);
router.post('/requests', requireAuth, sendFriendRequest);
router.post('/requests/:requestId/accept', requireAuth, acceptFriendRequest);
router.post('/requests/:requestId/decline', requireAuth, declineFriendRequest);
router.post('/requests/:recipientId/cancel', requireAuth, cancelFriendRequest);
router.delete('/:friendId', requireAuth, removeFriend);

export default router;
