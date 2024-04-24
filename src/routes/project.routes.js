// const express=require('express');
// const router=express.Router();
// const Project=require('../models/project.models') //Me traigo el modelo en cuestión
// const {uploadImage,deleteImage}=require('../helpers/cloudinary'); //Las funciones de subir y eliminar imagenes en cloudinary
// const fs=require('fs');
import express from 'express';
const router=express.Router();
import Project from '../models/project.models.js'; //Me traigo el modelo en cuestión
import {uploadImage,deleteImage} from '../helpers/cloudinary.js'; //Las funciones de subir y eliminar imagenes en cloudinary
import fs from 'fs';

//********** [MIDDLEWARE] **********/
//A este Middleware le paso el id de algún registro y me retorna el registro correspondiente.
const getProject=async(req,res,next)=>{
    let project;
    const {id}=req.params;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){ //Expresión regular para un id de mongo típico
        //404 -> Bad request
        return res.status(404).json({message:'El id no es válido, favor verificar'});
    }
    
    //Si el id es correcto debo interactuar ya con la BD.
    try{
        project=await Project.findById(id);

        //Incluso con un id válido puede que no se encuentre el proyecto
        if(!project){
            //200 -> OK
            return res.status(200).json({message:`El proyecto de id=${id} no fue encontrado`});
        }
    }catch(error){
        //500 -> Error interno del servidor
        return res.status(500).json({message:error.message});
    }

    res.project=project
    next();

} 

//********** [GET ALL] **********

router.get('/',async(req,res)=>{
    try{
        const projects=await Project.find();
        console.log('GET ALL PROJECTS',projects);

        if(projects.length===0){
            //204 -> No Content
            return res.status(204).json([]);
        }
        res.json(projects)
    }catch(error){
        //500 -> Error interno del servidor
        res.status(500).json({message:error.message})
    }
})


//********** [POST] **********

router.post('/',async(req,res)=>{
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
});


//********** [GET BY ID] **********
router.get('/:id',getProject,async(req,res)=>{
    res.json(res.project);
});

//********** [PUT] **********
router.put('/:id',getProject,async(req,res)=>{
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
});

// ********** [DELETE] **********
router.delete('/:id',getProject,async(req,res)=>{
    try{
        const project=res.project; //Guardo una copia para retornarlo en la petición una vez eliminado...
        
        await res.project.deleteOne({
            _id:req.params.id
        });
        res.json(project);

        //Una vez eliminado el proyecto hay que eliminar su respectiva imagen de cloudinary si es que la tiene
        if(project.image.public_id){
            await deleteImage(project.image.public_id);
        }
    }catch(error){
        //500 -> Error interno del servidor
        res.status(500).json({message:error.message});
    }
});

//Exporto las rutas
// module.exports=router;
export default router;