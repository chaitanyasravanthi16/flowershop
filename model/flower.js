var mongoose=require('mongoose')
var flowerSchema=mongoose.Schema({
    id:Number,
    name:String,
    description:String,
    image:String,
    price:Number,
    category:String
})
var flower=mongoose.model("flower",flowerSchema);
module.exports=flower;