import mongoose from 'mongoose';
import {config} from 'dotenv';
config();

const MONGODB_URL=process.env.MONGO_URL;
const MONGO_DB_NAME=process.env.MONGO_DB_NAME;

export const connectToDb=async()=>{
    try{
        await mongoose.connect(MONGODB_URL,{dbName:MONGO_DB_NAME});
        console.log('¡Conexión con MongoDB Exitosa!');
    }catch(error){
        console.log(error);
    }
}
