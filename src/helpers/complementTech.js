//La idea es que este archivo me ayude a complementar las tecnologías que guardo en BD
//Recibo un array con los nombres de las tecnologías, y quiero con esta info tener además la imagen respectiva...
import Technology from "../models/technology.models.js";

export const complementTech=async(stringArray)=>{ //Recibe un array con strings
    try{
        const technologies=await Technology.find({name:{$in:stringArray}});
        //Filtro sólo la información que quiero...
        const technologiesToSave=technologies.map(tech=>({name:tech.name,image:tech.image.secure_url}));
        return technologiesToSave;
    }catch(error){
        console.log(error);
        return stringArray;
    }
}