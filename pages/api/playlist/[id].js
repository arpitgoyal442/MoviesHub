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
export default async function Handler(req,res){

  connectDB()

    
    // playlist's _id
     const { id } = req.query;


    let {method}=req

    if(method=="GET"){

        let result = await Playlist.findById(id)
        console.log(result)

        if(result.ispublic){

            return res.status(200).send(result)
            
        }
        else{
          let jwt_token = req.headers.authorization?.replace('Bearer ', '');
           let ownerid =  req.headers['x-user-id'];
            


         try{
            let decoded =await verifyJWT(jwt_token)
         
            if(decoded.userid!=ownerid){
             // unauthorised
             res.status(401).send("Unauthorised Access!")
             return;
            }
            else{
               res.status(200).send(result)
               return;  
            }
             }catch(e){
       
                res.status(401).send(e)
                return
             }

        }
    }


    else{

        const { imdbId, title, year, movietype, poster } = req.body;

        try {
            
            const playlist = await Playlist.findById(id);
        
            if (!playlist) {
              return res.status(404).json({ error: 'Playlist not found' });
              
            }
        
            // Push the new movie data to the playlist's 'movies' array
            playlist.movies.push({
              imdbId,
              title,
              year,
              movietype,
              poster,
            });
        
            // Save the updated playlist
            await playlist.save();
            res.status(200).json({ message: 'Movie added to playlist' });
          } catch (err) {
            console.error('Error adding movie to playlist:', err);
            res.status(500).json({ error: 'Failed to add movie to playlist' });
          }




    }

}