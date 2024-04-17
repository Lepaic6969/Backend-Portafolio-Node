const mongoose=require('mongoose');

const technologySchema=new mongoose.Schema(
    {
        name:String,
        image:{
            public_id:String,
            secure_url:String
        }
    }
);

module.exports=mongoose.model('Technology',technologySchema);