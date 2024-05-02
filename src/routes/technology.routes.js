
import express from 'express';
const router=express.Router();

//Importamos los middlewares
import { getTechnology } from '../middlewares/getTechnology.js';
import { verifyToken } from '../middlewares/verifyToken.js';

//Importamos los controladores
import {getTechnologies,getTechnologyById,createTechnology,updateTechnology,deleteTechnology} from '../controllers/technology.controller.js';



//Estas rutas no alteran la base de datos y pueden ser accedidas por cualquier cliente.
router.get('/',getTechnologies);
router.get('/:id',getTechnology,getTechnologyById);
//Estas rutas alteran la base de datos y por tanto deben ser protegidas.
router.post('/',verifyToken,createTechnology);
router.put('/:id',[verifyToken,getTechnology],updateTechnology);
router.delete('/:id',[verifyToken,getTechnology],deleteTechnology);






//Exporto las rutas

export default router;

