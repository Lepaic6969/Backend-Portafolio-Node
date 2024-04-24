// const express=require('express');
// const mongoose=require('mongoose');
// const bodyParser=require('body-parser');
// const fileUpload=require('express-fileupload'); //Para poder recibir las imágenes
// const {config}=require('dotenv');
// config();

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload'; //Para poder recibir las imágenes
import {config} from 'dotenv';
config();

//Importo las rutas...
// const projectRoutes=require('./routes/project.routes');
// const technologiesRoutes=require('./routes/technology.routes');
import projectRoutes from './routes/project.routes.js';
import technologiesRoutes from './routes/technology.routes.js';

//Inicializo la app...
const app=express();
app.use(bodyParser.json()); //Para los Body que recibimos en las peticiones HTTP
app.use(fileUpload({ useTempFiles : true, tempFileDir : './uploads'})); //Para poder recibir las imágenes

//Nos conectamos con la base de datos que previamente hemos dado de alta...
mongoose.connect(process.env.MONGO_URL,{dbName:process.env.MONGO_DB_NAME});
const db=mongoose.connection;

//Integramos las rutas a la app
app.use('/projects',projectRoutes);
app.use('/technologies',technologiesRoutes);

const port=process.env.PORT || 3000;

//Ejecuto la app...
app.listen(port,()=>{
    console.log(`Servidor iniciado en el puerto: ${port}`);
});