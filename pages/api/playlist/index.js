import { HttpStatusCode } from "axios";
import Playlist from "../../../models/playlist";
import jwt from "jsonwebtoken";
import connectDB from "../../../lib/db";


function verifyJWT(token) {
  const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;

  return new Promise((resolve,reject)=>{


    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          console.log("Invalid token:", err.message);
          reject(err)
          
        } else {
          console.log("Decoded payload:", decoded);

          resolve(decoded)
         
        }
      });


  })

  
}

async function addPlaylist(req) {
  let { name, ownerId, isPublic } = req.body;
  console.log(isPublic)
  let playlist = new Playlist({
    name: name,
    ownerid: ownerId,
    movies: [],
    ispublic: isPublic,
  });

  try {
    let result = await playlist.save();
    return result;
  } catch (e) {
    throw e;
  }
}


export default async function Handler(req, res) {

  connectDB()



  let { method } = req;

  if (method == "GET") {

  

    let jwt_token = req.headers.authorization?.replace('Bearer ', '');
    let ownerid =  req.headers['x-user-id'];

    console.log(ownerid)
  
  
    // Verify the token
      
      try{
     let decoded =await verifyJWT(jwt_token)
    
  
     if(decoded.userid!=ownerid){
      
      // unauthorised
      res.status(401).send("Unauthorised Access!")
      return;
     }
     else{

        let result = await Playlist.find({ ownerid:ownerid });
        res.status(200).send(result)
        return
            
     }
  
      }catch(e){

         res.status(401).send(e)
         console.log(e)
         return
  
          
  
      }



  } 
  
  
  else {
    try {
      let result = await addPlaylist(req);
      res.status(200).send(result);
    } catch (e) {
      console.log(e)
      res.status(HttpStatusCode.InternalServerError).send(e);
    }
  }
}
