import Technology from '../models/technology.models.js';
import fs from 'fs';
import {uploadImage,deleteImage} from '../helpers/cloudinary.js';

export const getTechnologies=async(req,res)=>{
    try{
        const technologies=await Technology.find();
        if(technologies.length===0){
            //204 -> No Content
            return res.status(201).json([])
        }
        res.json(technologies)
    }catch(error){
        //500 -> Error Interno del Servidor
        res.status(500).json({message:error.message})
    }
}


export const getTechnologyById=async(req,res)=>{
    res.json(res.technology);
}


export const createTechnology=async(req,res)=>{
    const {name}=req?.body;
    if(!name){
        //400 -> Bad Request
        return res.status(400).json({message:'Recuerde enviar el nombre, este campo es obligatorio'});
    }

     //A partir de aquí todo está bien y me dedico es a generar y guardar el nuevo registro
    const technology=new Technology({name});
    //Si viene alguna imagen la proceso y guardo su información en el nuevo documento
    if(req.files?.image){
        const {public_id,secure_url}=await uploadImage(req.files.image.tempFilePath);
        technology.image={
            public_id,
            secure_url
        }
        //Una vez todo listo en cloudinary, elimino la imagen de la carpeta de archivos temporales
        fs.unlink(req.files.image.tempFilePath,(err)=>{
            if(err){
                console.error('Error al eliminar el archivo temporal');
                return;
            }
            console.log('Archivo temporal eliminado correctamente');
        });
    }
    try{
        const newTechnology=await technology.save();
        //201 -> Created
        res.status(201).json(newTechnology);
    }catch(error){
        //500 -> Error interno del servidor
        res.status(500).json({message:error.message})
    }
}


export const updateTechnology=async(req,res)=>{
    //Se debe enviar en el Body al menos algún parámetro a cambiar, de lo contrario no tiene sentido la
    //actualización.
    const {name}=req?.body;
    if(!name && !req.files?.image){
        //400 -> Bad Request
        return res.status(400).json({
            message:'Debe enviar al menos uno de estos campos a actualizar: name,image'
        });
    }
    //Si envía una imagen debo procesarla
    let uploadedImage=null;
    if(req.files?.image){
       const {public_id,secure_url}= await uploadImage(req.files.image.tempFilePath);
       uploadedImage={
        public_id,
        secure_url
       }
        //Una vez procesada la nueva imagen, la elimino de la carpeta de arcivos temporales
        fs.unlink(req.files.image.tempFilePath,(err)=>{
            if(err){
                console.error('Error al eliminar el archivo temporal');
                return;
            }
            console.log('Archivo temporal eliminado correctamente');
        });

        //Procedo a borrar la antigua imagen de cloudinary
        //const technology=await Technology.findById(req.params.id);
        if(res.technology.image.public_id){
            await deleteImage(res.technology.image.public_id);
            console.log("La imagen antigua ha sido actualizada en cloudinary.");
        }
    }
    try{
        const technology=res.technology;

        //Actualizo los cambios de la tecnología,
        technology.name=name || technology.name;
        technology.image=uploadedImage || technology.image;


        //Una vez actualizado el proyecto hacemos la actualización en Base de Datos

        const updatedTachnology=await technology.save();
        res.json(updatedTachnology);

    }catch(error){
        //400 -> Bad Request
        res.status(400).json({message:error.message});
    }
}
export const deleteTechnology=async(req,res)=>{
    try{
        const technology=res.technology; //Guardo una copia para retornarlo en la petición una vez eliminado...
        //Aquí creo que en lugar de res.project.deleteOne, debería ser Project.deleteOne
        await res.technology.deleteOne({
            _id:req.params.id
        });
        res.json(technology);
        //Una vez eliminado el documento en Base de Datos, debemos eliminar la imagen correspondiente de cloudinary
        if(technology.image.public_id){
            await deleteImage(technology.image.public_id);
            console.log("La imagen en cloudinary del documento eliminado, ha sido también eliminada.");
        }
    }catch(error){
        //500 -> Error interno del servidor
        res.status(500).json({message:error.message});
    }
}