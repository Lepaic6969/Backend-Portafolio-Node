const mongoose=require('mongoose');

const projectSchema=new mongoose.Schema(
    {
        name:String,
        short_description:String,
        complete_description:String,
        production_url:String,
        code_url:String,
        image:String,
        technologies:Array
    }
);

module.exports=mongoose.model('Project',projectSchema);