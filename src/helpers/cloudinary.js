// const {v2}=require('cloudinary');
// const {config}=require('dotenv'); //Para las variables de entorno
// config();
import {v2} from 'cloudinary';
import {config} from 'dotenv'; //Para las variables de entorno
config();

//Configuraciones para la conexión con cloudinary
v2.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

//Método para SUBIR imagen a cloudinary, recibe como parámetro filePath
//que se trata de la ruta de imagen en la carpeta de archivos temporales, llamada en este caso 'uploads'
//Este parámetro lo sacas de req.body.image.tempFilePath
export const uploadImage=async(filePath)=>{
    return await v2.uploader.upload(filePath,{
        folder:'portafolio' //Esto crea una carpeta con el nombre de portafolio en cloudinary donde se albergarán las imágenes
    });
}

//ELIMINAR IMAGEN -> Recibe public_id que es el id de la imagen que genera cloudinary al momento de cargarla.
export const deleteImage=async(public_id)=>{
    return await v2.uploader.destroy(public_id);
}

// module.exports={
//     uploadImage,
//     deleteImage
// };

