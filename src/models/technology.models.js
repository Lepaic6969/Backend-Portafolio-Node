// const mongoose=require('mongoose');
import mongoose from 'mongoose';

const technologySchema=new mongoose.Schema(
    {
        name:String,
        image:{
            public_id:String,
            secure_url:String
        }
    },
    {
        timestamps:true,
        versionKey:false
    }
);

// module.exports=mongoose.model('Technology',technologySchema);
export default mongoose.model('Technology',technologySchema);