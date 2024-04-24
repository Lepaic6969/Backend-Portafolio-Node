import Project from '../models/project.models.js';
import { uploadImage,deleteImage } from '../helpers/cloudinary.js';
import fs from 'fs';

export const getProjects=async(req,res)=>{
    try{
        const projects=await Project.find();

        if(projects.length===0){
            //204 -> No Content
            return res.status(204).json([]);
        }
        res.json(projects)
    }catch(error){
        //500 -> Error interno del servidor
        res.status(500).json({message:error.message})
    }
}
export const getProjectById=async(req,res)=>{
    res.json(res.project);
}



export const createProject=async(req,res)=>{
    const {name,short_description,complete_description,production_url,code_url,technologies}=req?.body;
    //Primero verifico que vengan todos los campos en el JSON de la petición (Con excepción de la imagen)
    if(!name||!short_description||!complete_description||!production_url||!code_url || !technologies){
        //400 -> Bad Request
        return res.status(400).json({message:'Recuerde enviar todos los campos en el Body de la petición'});
    }

    //A partir de aquí todo está bien y me dedico es a generar y guardar el nuevo registro
    const project=new Project(
        {
            name,
            short_description,
            complete_description,
            production_url,
            code_url,
            technologies
        }
    );
    //Si viene alguna imagen la subo a cloudinary y agrego la url al nuevo documento...
    if(req.files?.image){
        const {public_id,secure_url}=await uploadImage(req.files.image.tempFilePath); //Le paso la ruta de la imagen en la carpeta de archivos temporales
        project.image={
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
        const newProject=await project.save();
        //201 -> Created
        res.status(201).json(newProject);
    }catch(error){
        //500 -> Error interno del servidor
        res.status(500).json({message:error.message});
    }
}
export const updateProject=async(req,res)=>{
    //Se debe enviar en el Body al menos algún parámetro a cambiar, de lo contrario no tiene sentido la
    //actualización.
    const {name,short_description,complete_description,production_url,code_url,technologies}=req?.body;
    if(!name && !short_description && !complete_description && !production_url && !code_url && !technologies && !req.files?.image){
        //400 -> Bad Request
        return res.status(400).json({
            message:'Debe enviar al menos uno de estos campos a actualizar: name,short_description,complete_description,production_url,code_url,technologies,image.'
        });
    }
    //Además si me envían una imagen debo procesarla
    let uploadedImage=null; //Arranco sin ninguna imagen
    if(req.files?.image){
        const {public_id,secure_url}=await uploadImage(req.files.image.tempFilePath);
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

        //Ahora hay que eliminar la imagen vieja de cloudinary
        //const project=await Project.findById(req.params.id);
        if(res.project.image.public_id){
            await deleteImage(res.project.image.public_id);
            console.log("Imagen vieja de cloudinary borrada.");
        }
    }
    try{
        const project=res.project;

        //Actualizo los cambios del proyecto
        project.name=name || project.name,
        project.short_description=short_description || project.short_description,
        project.complete_description=complete_description || project.complete_description,
        project.production_url=production_url || project.production_url,
        project.code_url=code_url || project.code_url,
        project.image=uploadedImage || project.image,
        project.technologies=technologies || project.technologies

        //Una vez actualizado el proyecto hacemos la actualización en Base de Datos

        const updatedProject=await project.save();
        res.json(updatedProject);

    }catch(error){
        //400 -> Bad Request
        res.status(400).json({message:error.message});
    }
}


export const deleteProject=async(req,res)=>{
    try{
        const project=res.project; //Guardo una copia para retornarlo en la petición una vez eliminado...
        
        await res.project.deleteOne({
            _id:req.params.id
        });
        res.json(project);

        //Una vez eliminado el proyecto hay que eliminar su respectiva imagen de cloudinary si es que la tiene
        if(project.image.public_id){
            await deleteImage(project.image.public_id);
            console.log("La imagen del documento eliminado, también ha sido eliminada de Cloudinary");
        }
    }catch(error){
        //500 -> Error interno del servidor
        res.status(500).json({message:error.message});
    }
}