const mongoose=require('mongoose');
const Schema =mongoose.Schema;

const ArticleSchema=new Schema({
    AuthorId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
    },
    description:{
        type:String
    },
    body:{
        type:String,
        required:true
    },
    categories:[
       {type:mongoose.SchemaTypes.ObjectId,ref:'Category'}
    ],
    date:{
        type:String,
        default:new Date()
    }
})

module.exports=Article=mongoose.model("article",ArticleSchema);
