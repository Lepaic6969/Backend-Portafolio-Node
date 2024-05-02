import User from '../models/user.models.js';
import jwt from 'jsonwebtoken';
import {encryptPassword,comparePassword} from '../helpers/encrypt.js';



export const signup=async(req,res)=>{
    const {username,email,password}=req?.body;

    //Valido que me hayan enviado los campos que son obligatorios
    if(!username || !email || !password){
        //400 -> Bad request
        return res.status(400).json({message:'Es obligatorio enviar los campos "username","email" y "password"'});
    }
    try{
        //Aquí debo verificar primero si el usuario ya existe...
            const userFound=await User.findOne({username,email});
            if(userFound){
                //409 -> Conflict
                return res.status(409).json({message:'¡El usuario ya existe!'});
            }
        //Si no existe el usuario pues lo agrego
            const user=new User(
                {
                    username,
                    email,
                    password:await encryptPassword(password)
                }
            );
            const newUser=await user.save();
    
            //Creamos el token...
            const token=jwt.sign({id:newUser._id},process.env.SECRET_JWT,{
                expiresIn:86400 //Este token expira en un día
            });
            //201 -> Created
            res.status(201).json({token});
        }catch(error){
            //500 -> Error interno del servidor
            res.status(500).json({message:error.message});
        }
    
}

export const login=async(req,res)=>{
    const {email,password}=req?.body;

    //400-> Bad Request
    if(!email || !password) return res.status(400).json({message:"Recuerde que el email y el password son obligatorios"});

    try{
        //Verifico si el usuario existe
        const userFound=await User.findOne({email});

        //409 -> Conflict
        if(!userFound) return res.status(409).json({message:"¡El usuario no exite!"});

        //Si el usuario existe debo verificar la contraseña...
        const matchPassword=await comparePassword(password,userFound.password);
        //401 -> Sin autorización
        if(!matchPassword) return res.status(401).json({message:"¡Contraseña Incorrecta!"});

        //Aquí todos los datos están correctos, por lo que debemos generar el token
        const token=jwt.sign({id:userFound._id},process.env.SECRET_JWT,{
            expiresIn:86400 //Para que el token dure todo un día
        });
        res.json({token});

    }catch(error){
        res.status(500).json({message:error.message});
    }

  
}