import express from 'express';
import multer from 'multer';
import {
  getProfile,
  listProfiles,
  updateProfile,
  uploadProfileImage,
} from '../controllers/profilesController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', requireAuth, listProfiles);
router.get('/:id', requireAuth, getProfile);
router.put('/me', requireAuth, updateProfile);
router.post('/me/avatar', requireAuth, upload.single('avatar'), uploadProfileImage);

export default router;
