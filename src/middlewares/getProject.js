import Project from '../models/project.models.js';
export const getProject=async(req,res,next)=>{
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