import mongoose from "mongoose";

const playlistSchema=mongoose.Schema({

    name:String,
    ownerid:String,
    movies:[{
        
        imdbId:String,
        title:String,
        year:String,
        movietype:String,
        poster:String
    }],

    ispublic:{
        type:Boolean,
        default:true
    }

})





export default mongoose.models.Playlist || mongoose.model('Playlist', playlistSchema);