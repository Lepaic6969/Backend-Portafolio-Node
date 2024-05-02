import {Router} from 'express';
const router=Router();
//Importo los controladores
import {login,signup} from '../controllers/auth.controller.js';

router.post('/login',login);
router.post('/signup',signup);

export default router;