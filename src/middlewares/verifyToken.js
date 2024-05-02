import jwt from 'jsonwebtoken';
import {config} from 'dotenv';
config();
import User from '../models/user.models.js';

export const verifyToken=async(req,res,next)=>{
    const token=req.headers['x-access-token'];

    //403 -> Prohibido
    if(!token) return res.status(403).json({message:'Recuerde enviar el token.'});
    try{
        const decoded=jwt.verify(token,process.env.SECRET_JWT);
        const user=await User.findById(decoded.id,{password:0}); //Para que el usuario no me llegue con password
        //404 -> Not Found
        if(!user) return res.status(404).json({message:"¡El token no es válido!"});
        //Si llega hasta aquí quiere decir que todo está bien entonces lo dejo seguir...
        next();
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}