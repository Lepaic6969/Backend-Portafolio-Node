import mongoose from 'mongoose';

const projectSchema=new mongoose.Schema(
    {
        name:String,
        short_description:String,
        complete_description:String,
        production_url:String,
        code_url:String,
        technologies:Array,
        image:{
            public_id:String,
            secure_url:String
        }
    },{
        timestamps:true,
        versionKey:false
    }
);

export default mongoose.model('Project',projectSchema);