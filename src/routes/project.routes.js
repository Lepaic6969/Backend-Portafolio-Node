import express from 'express';
const router=express.Router();

//Importo los Middlewares
import { getProject } from '../middlewares/getProject.js';

//Importo los Controllers
import {getProjects,getProjectById,createProject,updateProject,deleteProject} from '../controllers/product.controller.js';

//A Estas rutas va a poder acceder cualquier cliente.
router.get('/',getProjects);
router.get('/:id',getProject,getProjectById);
//Estas rutas modifican la base de datos, por tanto son las rutas que debo proteger
router.post('/',createProject);
router.put('/:id',getProject,updateProject);
router.delete('/:id',getProject,deleteProject);






//Exporto las rutas
export default router;