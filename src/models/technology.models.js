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

export default mongoose.model('Technology',technologySchema);