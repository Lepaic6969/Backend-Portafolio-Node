const express=require('express');
const router=express.Router();
const Technology=require('../models/technology.models'); //Modelo previamente creado


//********** [MIDDLEWARE] **********/
//A este Middleware le paso el id de algún registro y me retorna el registro correspondiente.
const getTechnology=async(req,res,next)=>{
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


//********** [GET ALL] **********/

router.get('/',async(req,res)=>{
    try{
        const technologies=await Technology.find();
        console.log('GET ALL TECHNOLOGIES',technologies);
        if(technologies.length===0){
            //204 -> No Content
            return res.status(201).json([])
        }
        res.json(technologies)
    }catch(error){
        //500 -> Error Interno del Servidor
        res.status(500).json({message:error.message})
    }
});

//********** [POST] **********/
router.post('/',async(req,res)=>{
    const {name,image}=req?.body;
    if(!name||!image){
        //400 -> Bad Request
        return res.status(400).json({message:'Recuerde enviar todos los campos en el Body de la petición'});
    }

     //A partir de aquí todo está bien y me dedico es a generar y guardar el nuevo registro
     const technology=new Technology(
        {
            name,
            image
        }
    );
    try{
        const newTechnology=await technology.save();
        console.log(newTechnology)
        //201 -> Created
        res.status(201).json(newTechnology);
    }catch(error){
        //500 -> Error interno del servidor
        res.status(500).json({message:error.message})
    }
});

//********** [GET BY ID] **********
router.get('/:id',getTechnology,async(req,res)=>{
    res.json(res.technology);
});


//********** [PUT] **********
router.put('/:id',getTechnology,async(req,res)=>{
    //Se debe enviar en el Body al menos algún parámetro a cambiar, de lo contrario no tiene sentido la
    //actualización.
    const {name,image}=req?.body;
    if(!name && !image){
        //400 -> Bad Request
        return res.status(400).json({
            message:'Debe enviar al menos uno de estos campos a actualizar: name,image'
        });
    }
    try{
        const technology=res.technology;

        //Actualizo los cambios de la tecnología,
        technology.name=name || technology.name;
        technology.image=image || technology.image;


        //Una vez actualizado el proyecto hacemos la actualización en Base de Datos

        const updatedTachnology=await technology.save();
        res.json(updatedTachnology);

    }catch(error){
        //400 -> Bad Request
        res.status(400).json({message:error.message});
    }
});


// ********** [DELETE] **********
router.delete('/:id',getTechnology,async(req,res)=>{
    try{
        const technology=res.technology; //Guardo una copia para retornarlo en la petición una vez eliminado...
        //Aquí creo que en lugar de res.project.deleteOne, debería ser Project.deleteOne
        await res.technology.deleteOne({
            _id:req.params.id
        });
        res.json(technology);
    }catch(error){
        //500 -> Error interno del servidor
        res.status(500).json({message:error.message});
    }
});







//Exporto las rutas
module.exports=router;

