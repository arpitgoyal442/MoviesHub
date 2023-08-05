
import { HttpStatusCode } from "axios";
import User from "../../../models/user-model"
import bcrypt from "bcrypt"
import connectDB from "../../../lib/db";
import jwt from "jsonwebtoken"





function isPasswordOk(userProvidedPassword, hashedPassword) {
  return new Promise((resolve, reject) => {
      bcrypt.compare(userProvidedPassword, hashedPassword, (err, result) => {
          if (err) {
              console.error('Error comparing passwords:', err);
              reject(err);
          } else if (result) {
              console.log('Password is correct. Allow login.');
              resolve(true);
          } else {
              console.log('Password is incorrect. Deny login.');
              resolve(false);
          }
      });
  });
}

function generateJwtToken(userid){
  let secret_key=process.env.NEXT_PUBLIC_JWT_SECRET_KEY

   return jwt.sign({userid:userid},secret_key, { expiresIn: '36500d' })
}




export default  async function signinHandler(req,res){

  connectDB()

    // Collect email and password

    let {email,password}=req.body;

    // Fetch the user corresponding to email
    let user= await User.findOne({email:email})
    
    if(user==null){
        return res.status(401).send("Account don't exist")
    
    }

    let userid=String(user._id)
   

    // match the password

    
     isPasswordOk(password,user.password).then((isOk)=>{


      if(isOk){
        let token=generateJwtToken(userid)
       return res.status(200).json({id:userid,jwt_token:token})
      }


      else return res.status(401).send("Deny login");

     }).catch((err)=>{
      console.log(err);
       return res.status(500).send(err);
     })

    
  
    }
    

    


    

   

