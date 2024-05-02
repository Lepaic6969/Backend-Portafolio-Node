//Este archivo nos ayuda a cifrar contraseñas y a comparar contraseñas cifradas con contraseñas sin cifrar.
import bcrypt from 'bcryptjs';

export const encryptPassword=async(password)=>{
    const salt=await bcrypt.genSalt(10); //Número de veces que se aplica el algoritmo
    return await bcrypt.hash(password,salt);
}

export const comparePassword=async(password,encryptedPassword)=>{
    return await bcrypt.compare(password,encryptedPassword); //Retorna un booleano
}