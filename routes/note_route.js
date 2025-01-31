import { Router} from 'express';
import { createNote, getNotes, getNote, checkOTP, softDeleteNote, retrieveNote, deleteNote } from '../controllers/notes_control.js';
import { verifyUser } from '../middle_ware/verify_user.js';

const router = Router();

router.post('/', verifyUser, createNote);
router.get('/', verifyUser, getNotes);
router.get('/:noteId', verifyUser, getNote);
router.get('/:noteId/delete', verifyUser, softDeleteNote);
router.delete('/:noteId', verifyUser, deleteNote);
router.get('/:noteId/retrieve', verifyUser, retrieveNote);
router.post('/:noteId/verify-otp', verifyUser, checkOTP);

export default router;