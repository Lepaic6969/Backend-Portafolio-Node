import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload'; //Para poder recibir las imágenes
import morgan from 'morgan';
import {config} from 'dotenv';
config();

//Importo la conexión con DB
import {connectToDb} from './helpers/mongoConnection.js';

//Importo las rutas...
import projectRoutes from './routes/project.routes.js';
import technologiesRoutes from './routes/technology.routes.js';
import authRoutes from './routes/auth.routes.js';

//Inicializo la app...
const app=express();
app.use(bodyParser.json()); //Para los Body que recibimos en las peticiones HTTP
app.use(fileUpload({ useTempFiles : true, tempFileDir : './uploads'})); //Para poder recibir las imágenes
app.use(morgan('dev'));

//Nos conectamos con la base de datos que previamente hemos dado de alta...
connectToDb();

//Integramos las rutas a la app
app.use('/projects',projectRoutes);
app.use('/technologies',technologiesRoutes);
app.use('/auth',authRoutes);

const port=process.env.PORT || 3000;

//Ejecuto la app...
app.listen(port,()=>{
    console.log(`Servidor iniciado en el puerto: ${port}`);
});