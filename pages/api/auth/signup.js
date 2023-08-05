
import { HttpStatusCode } from "axios";
import connectDB from "../../../lib/db";
import User from "../../../models/user-model";
import bcrypt from "bcrypt";

function Encrypt_Password(password) {
  const saltRounds = 10; // Number of salt rounds for hashing

  return new Promise((resolve,reject)=>{


    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          reject(err)
        } else {
          console.log("Hashed password:", hashedPassword);
          resolve(hashedPassword)
        }
      });



  })
  

  
}

export default async function signupHandler(req, res) {
  // Encrypt the password and then save to db

  connectDB();

  let {email,password}=req.body

  // First Check if User already exist

  let u= await User.findOne({email:email})

  if(u!=null)
  {
    res.status(HttpStatusCode.ImUsed).send("User Already Exist")
    return;
  }


 

  let hashed_password

  try{
  hashed_password = await Encrypt_Password(password)
  }catch(e){
    res.status(404).json({"unable to encrypt passoword dut to :":e})
    return;
  }

  console.log(hashed_password)

  let user = new User({
    email: email,
    password: hashed_password,
  });

  try {
    let saving_result = await user.save();
    res.status(200).send(saving_result);
  } catch (e) {
    res.status(404).send(e);
    return
  }

  // res.status(200).json({ name: req.body })
}
