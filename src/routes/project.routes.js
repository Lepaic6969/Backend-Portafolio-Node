const express=require('express');
const router=express.Router();
const Project=require('../models/project.models') //Me traigo el modelo en cuestión

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
    const {name,short_description,complete_description,production_url,code_url,image,technologies}=req?.body;
    //Primero verifico que vengan todos los campos en el JSON de la petición
    if(!name||!short_description||!complete_description||!production_url||!code_url||!image||!technologies){
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
            image,
            technologies
        }
    );

    try{
        const newProject=await project.save();
        console.log(newProject);
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
    const {name,short_description,complete_description,production_url,code_url,image,technologies}=req?.body;
    if(!name && !short_description && !complete_description && !production_url && !code_url && !image && !technologies){
        //400 -> Bad Request
        return res.status(400).json({
            message:'Debe enviar al menos uno de estos campos a actualizar: name,short_description,complete_description,production_url,code_url,image,technologies'
        });
    }
    try{
        const project=res.project;

        //Actualizo los cambios del proyecto
        project.name=name || project.name,
        project.short_description=short_description || project.short_description,
        project.complete_description=complete_description || project.complete_description,
        project.production_url=production_url || project.production_url,
        project.code_url=code_url || project.code_url,
        project.image=image || project.image,
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
        //Aquí creo que en lugar de res.project.deleteOne, debería ser Project.deleteOne
        await res.project.deleteOne({
            _id:req.params.id
        });
        res.json(project);
    }catch(error){
        //500 -> Error interno del servidor
        res.status(500).json({message:error.message});
    }
});

//Exporto las rutas
module.exports=router;