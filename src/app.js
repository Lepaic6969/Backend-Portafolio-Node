const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const {config}=require('dotenv');
config();

//Importo las rutas...
const projectRoutes=require('./routes/project.routes');
const technologiesRoutes=require('./routes/technology.routes');

//Inicializo la app...
const app=express();
app.use(bodyParser.json()); //Para los Body que recibimos en las peticiones HTTP
//app.use(bodyParser.urlencoded({ extended: true })); //Este sería para el Form Data, del resto se trabajaría igual


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