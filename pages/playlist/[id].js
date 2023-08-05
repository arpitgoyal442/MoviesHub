import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import MovieCard from "../../components/movieCard";
import styles from "../../styles/singleplaylist.module.css"

export default function APlaylist({movies}) {
 
//   const [movies, setMovies] = useState([]);

console.log(movies.length)

  


  return (
    <div className={styles.container}>

      {movies.length>0? movies.map((movie) => (
        <MovieCard
        key={movie.imdbID}
        title={movie.title}
        year={movie.year}
        imdbID={movie.imdbId}
        type={movie.movietype}
        poster={movie.poster}
      />
      ))   :  <div className={styles.protected_message}>

        <img src="/images/private_icon.png" alt="" />
        <h2>Can't be Accessed</h2>

      </div>
      
      }

      
    </div>
  );
}


export async function getServerSideProps({params}){

    let {id}=params
    let URL=  process.env.NEXT_PUBLIC_SITE_URL
    

  try {
    const response = await axios.get(
      `${URL}/api/playlist/${id}`
    );
    const movies = response.data.movies;

    console.log(movies)
    
    return {
      props: {
        movies,
      },
    };
  } catch (error) {
    console.log(error);
    const movies=[]
    return {
      props: {
        movies,
      },
    };
  }

}
