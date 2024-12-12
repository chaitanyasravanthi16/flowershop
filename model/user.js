var mongoose=require('mongoose');
var userSchema=new mongoose.Schema({
    username:String,
    password:String,
    phone:String,
    email:String,
    role:String,
    wishlist:[{ type: mongoose.Schema.Types.ObjectId, ref: 'flower' }] 
})
var user=mongoose.model("users",userSchema);
module.exports=user;