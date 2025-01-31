import { Router } from 'express';
import { signupGet, signupPost, loginGet, loginPost, logout, deleteUser } from '../controllers/auth_control.js';
import { verifyUser } from '../middle_ware/verify_user.js';

const router = Router();

router.get('/signup', signupGet);
router.post('/signup', signupPost);
router.get('/login', loginGet);
router.post('/login', loginPost);
router.get('/logout', logout);
router.delete('/:id',  verifyUser, deleteUser);

export default router;