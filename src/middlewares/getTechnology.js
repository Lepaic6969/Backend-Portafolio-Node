import Technology from '../models/technology.models.js';

//A este Middleware le paso el id de algún registro y me retorna el registro correspondiente.
export const getTechnology=async(req,res,next)=>{
    let technology;
    const {id}=req.params;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){ //Expresión regular para un id de mongo típico
        //404 -> Bad request
        return res.status(404).json({message:'El id no es válido, favor verificar'});
    }
    
    //Si el id es correcto debo interactuar ya con la BD.
    try{
        technology=await Technology.findById(id);

        //Incluso con un id válido puede que no se encuentre el proyecto
        if(!technology){
            //200 -> OK
            return res.status(200).json({message:`La tecnología de id=${id} no fue encontrada`});
        }
    }catch(error){
        //500 -> Error interno del servidor
        return res.status(500).json({message:error.message});
    }

    res.technology=technology;
    next();
} 
