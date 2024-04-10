import axios from 'axios'

const uploadImage=async(file)=>{
    if(!file) return
    try{
        const formData=new FormData()
        formData.append('upload_preset','vue-imagenes-daybook')
        formData.append('file', file)

        const url='https://api.cloudinary.com/v1_1/dayyf07kb/image/upload'
        const {data}=await axios.post(url,formData)
        return data.secure_url //Retorno el enlace de la imagen en cloudinary
    }catch(err){
        console.error("Error al cargar la imagen")
        console.log(err)
        return null
    }
}

export default uploadImage