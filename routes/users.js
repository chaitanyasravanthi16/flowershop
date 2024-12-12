var express = require('express');
var User=require('../model/user');
var bcrypt=require('bcryptjs');
const { response } = require('../app');
var router = express.Router();
var jwt=require('jsonwebtoken')
var mailer=require('nodemailer')
require('dotenv').config();

router.post('/registration',(req,res)=>{
  User.findOne({username:req.body.username})
  .then( async(dbuser)=>{
    if(dbuser!=null){
      res.send({status:"user already existed"})
    }
    else{
      console.log(dbuser)
      var newuser=new User({
        username:req.body.username,
        password:await bcrypt.hash(req.body.password,10),
        phone:req.body.phone,
        email:req.body.email,
        role:req.body.role
      })
      
      newuser.save()
      .then((result)=>{
        var transport=mailer.createTransport({
          host:"smtp.gmail.com",
          auth:{
            user:"chaitanyasravanthi2002@gmail.com",
            pass:"ikqw blno qdbc zacx"
          }
        })
        var mailoptions={
          from:"chaitanyasravanthi2002@gmail.com",
          to:req.body.email,
          subject:"Registration successfull in our website",
          text:"Hello"+req.body.username+"Younhave successfully registered in our website"
        }
        transport.sendMail(mailoptions,(err,info)=>{
          console.log("mailoptions",mailoptions)
          if(err){
            console.log(err)
          }
          else{
            console.log("Email sent:"+info.response)
          
          }
        })
        res.send({status:"user registered successfully",response:result})})
      .catch((err)=>console.log(err));

    }
  })
  .catch((err)=>console.log(err));
})




router.post("/login",(req,res)=>{
  User.findOne({username:req.body.username })
  .then(async (dbuser)=>{
    if(dbuser!=null){
      if(await bcrypt.compare(req.body.password,dbuser.password))
      {
        const token=jwt.sign({username:dbuser.username},process.env.JWT_Secret,{expiresIn:'1h'})
        res.send({status:"login successful", jwttoken:token,response:dbuser})
      }
      else{
        res.send({status:"inavalid username or password"})
      }
    }
    else{
      res.send({ status:"user not found"})
    }
  })
  .catch((err)=>res.send({status:"something went wrong"}))
})

router.get('/wishlist/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID and populate the wishlist with furniture details
    const user = await User.findById(userId).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.wishlist); // Return the populated wishlist
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error });
  }
});







router.post('/wishlist/add', async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId); // Add product to wishlist
      await user.save();
      return res.status(200).json({ message: 'Product added to wishlist', wishlist: user.wishlist });
    }

    res.status(400).json({ message: 'Product already in wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error });
  }
});


module.exports = router;
