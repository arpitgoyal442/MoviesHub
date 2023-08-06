import { useRouter } from "next/router";
import axios from "axios";
import {  useState,useEffect } from "react";

import MovieCard from "../../components/movieCard";
import styles from "../../styles/singleplaylist.module.css"

export default function APlaylist() {


  let URL=process.env.NEXT_PUBLIC_SITE_URL;
  let myRouter=useRouter()
  const {id}=myRouter.query
  
  // 

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const jwt_token = localStorage.getItem('jwt_token');
    const userid = localStorage.getItem('userid');
    

    console.log("id is"+id)

    // Use the axios instance to make the request
    if(id){
    axios
      .get(`${URL}/api/playlist/${id}`,{
        headers: {
          Authorization: `Bearer ${jwt_token}`,
          "X-User-ID": userid,
        },
      })
      .then((response) => {
        console.log(response)
        setMovies(response.data.movies);
      })
      .catch((error) => {
        console.error('Error fetching playlist:', error);
      });

    }
    }, [id]);



 

  // 
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
      ))   :  (  < div className={styles.protected_message}>

        <img src="/images/private_icon.png" alt="" />
        <h2>Can't be Accessed</h2>

      </div>)
      
      }

      
    </div>
  );
}


// export async function getServerSideProps({params}){

//     let {id}=params
//     let URL=  process.env.NEXT_PUBLIC_SITE_URL
    

//   try {
//     const response = await axios.get(
//       `${URL}/api/playlist/${id}`
//     );
//     const movies = response.data.movies;

//     console.log(movies)
    
//     return {
//       props: {
//         movies,
//       },
//     };
//   } catch (error) {
//     console.log(error);
//     const movies=[]
//     return {
//       props: {
//         movies,
//       },
//     };
//   }

// }
