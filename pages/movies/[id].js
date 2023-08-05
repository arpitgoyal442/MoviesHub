
import React, { useEffect, useState } from 'react';
import Head from 'next/head';

import styles from '../../styles/moviedetails.module.css'; // Import the CSS file
import axios from 'axios';


const MovieDetails = ({movieData}) => {

  let URL=  process.env.NEXT_PUBLIC_SITE_URL

  const [playlists,setPlaylists]=useState([])


  const [showPlaylistSelector,setShowPlaylistSelector]=useState(false)

    

  async function fetchPlaylists(){

    
    
    let jwt_token=localStorage.getItem("jwt_token")
    let userid=localStorage.getItem("userid")

    if(jwt_token==null || jwt_token==""||userid==null || userid=="")
    return;


    // Get all the playlists of the user

   await axios.get(`${URL}/api/playlist`,{
     headers: {
       Authorization: `Bearer ${jwt_token}`,
       'X-User-ID': userid,
     },
   }).then((data)=>{
     console.log(data.data);
     setPlaylists((pre)=>{
       return [...pre,...data.data]
     })

     console.log(playlists)

   }).catch((e)=>{
     console.log(e)
   })

  }

  useEffect(()=>{

    // fetch all the playlists and set to playlists-useState
    fetchPlaylists()

  },[])


  function handleAddClicked(){


    let jwt_token=localStorage.getItem("jwt_token")
    let userid=localStorage.getItem("userid")

    if(jwt_token==null || jwt_token==""||userid==null || userid=="")
    {
      alert("Login to Create and manage playlists")
      return
    }



    setShowPlaylistSelector(true)
  }


  async function playlistClicked(e){

    let playlistid=e.target.getAttribute('value');
    setShowPlaylistSelector(false)

    let data={
      imdbId:movieData.imdbID,
      title:movieData.Title,
       year:movieData.Year,
       movietype:movieData.Type,
       poster:movieData.Poster
    }

    // Adding movie to playlist
    await axios.post(`${URL}/api/playlist/${playlistid}`,data).then((data)=>{

    console.log(data)

    }).catch((e)=>{
      console.log(errorToJSON)
    })


  }
  

  return (
    <div className={styles.container}>
      <Head>
        <title>{movieData.Title}</title>
      </Head>

        

      <div className={styles.movieDetails}>
        <div className={styles.posterContainer}>
          <img src={movieData.Poster} alt={movieData.Title} />
        </div>
        <div className={styles.detailsContainer}>
          <h1 className={styles.title}>{movieData.Title}</h1>
          <p className={styles.info}>
            {movieData.Year} | {movieData.Genre} | {movieData.Runtime}
          </p>
          <p className={styles.plot}>{movieData.Plot}</p>
          <p className={styles.director}>
            <strong>Director:</strong> {movieData.Director}
          </p>
          <p className={styles.writer}>
            <strong>Writer:</strong> {movieData.Writer}
          </p>
          <p className={styles.actors}>
            <strong>Actors:</strong> {movieData.Actors}
          </p>
          <p className={styles.rating}>
            <strong>IMDb Rating:</strong> {movieData.imdbRating}
          </p>
        </div>
       
      </div>

       <div className={styles.bplay}>
      <button onClick={handleAddClicked}>Add to Playlist</button>
      { showPlaylistSelector && <div className={styles.playlistBox}>
      <ul>
      {playlists.map((playlist) => (
        <li key={playlist._id} value={playlist._id} onClick={playlistClicked}>
          {playlist.name}
        </li>
      ))}
    </ul>
        </div>}
      </div>
    

      
    </div>
  );
};



export async function getServerSideProps({ params }) {
  // 'params' contains the dynamic route parameters, e.g., { imdbid: 'tt15600222' }
  const { id } = params;

  try {
    const response = await axios.get(
      `https://omdbapi.com/?apikey=138b6a27&i=${id}&plot=full`
    );
    const movieData = response.data;

    console.log(movieData)
    

    
    

    return {
      props: {
        movieData,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        movieData: {},
      },
    };
  }
}


export default MovieDetails;
