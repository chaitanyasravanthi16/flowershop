var express = require('express');
var flower=require('../model/flower');
const { response } = require('../app');
var router = express.Router();


router.get("/flowers",(req,res)=>{
   flower.find({})
   .then((docs)=>res.send(docs))
   .catch((err)=>console.log(err))
})
router.get("/getmaxproducts",(req,res)=>{
  const{price}=req.query;
  flower.find({price:{$gt:price}})
  .then((docs)=>res.send(docs))
  .catch((err)=>console.log(err))
})
router.get("/getproducts",(req,res)=>{
  const{minprice,maxprice}=req.query;
  flower.find({price:{$gt:maxprice,$lt:minprice}})
  .then((docs)=>res.send(docs))
  .catch((err)=>console.log(err))
})
//pagination
router.get("/pagination",(req,res)=>{
   const{page,limitnum}=req.query;
   const skipnum=(page-1)*limitnum;
   flower.find({}).skip(skipnum).limit(limitnum)
   .then((docs)=>res.send(docs))
   .catch((err)=>console.log(err))
})
router.post("/add",(req,res)=>{
  var newproduct=new flower(req.body);
  newproduct.save()
  .then(()=>{res.send({status:'success',response:newproduct})})
  .catch((err)=>{console.log(err)})
})
router.get("/addmany",(req,res)=>{
  flower.insertMany(req.body)
  .then((result)=>res.send({status:"added successfully",response:result}))
  .catch((err)=>console.log(err))
})
router.get("/products/:id",(req,res)=>{
  flower.findOne({id:req.params.id})
  .then((docs)=>res.send(docs))
   .catch((err)=>console.log(err))
})
router.get("/search",(req,res)=>{
  const{name}=req.query;
  flower.find({name:new RegExp(name,'i')})
  .then((docs)=>res.send(docs))
  .catch((err)=>console.log(err))
})
//router.delete("/delete/:id",(req,res)=>{
//flower.findByIdAndDelete(req.params.id)
  //.then(()=>res.send("deleted successfully"))
   //.catch((err)=>console.log(err))
  //})
  router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedflower = await flower.findByIdAndDelete(req.params.id);

    if (!deletedflower) {
      // Record not found
      return res.status(404).json({ message: "flower product not found" });
    }

    // Successful deletion
    res.status(200).json({ message: "Deleted successfully", data: deletedflower });
  } catch (error) {
    // Error occurred
    console.error(error);
    res.status(500).json({ message: "Error deleting flower product", error });
  }
});


router.put('/update/:id',(req,res)=>{
  flower.findByIdAndUpdate(req.params.id,req.body)
  .then(()=>{res.send("updated successfully")})
  .catch((err)=>{console.log(err)})
})

module.exports = router;
