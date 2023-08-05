import { useState } from "react";
import MovieCard from "../components/movieCard";
import styles from "../styles/Home.module.css";
import axios from "axios";

export default function home({ data }) {
  const movies = data;
  let api_key=process.env.NEXT_PUBLIC_OMDB_KEY

  const [searchMovieName, setSearchMovieName] = useState("");
  const [searchMovie,setSearchMovie]=useState(null);

  function searchChange(e) {
    setSearchMovieName(e.target.value);
    console.log(e.target.value)

    if(e.target.value=="")
    {
      setSearchMovie(null)
    }
  }

  async function makeSearch() {

    let movieName= encodeURIComponent(searchMovieName)
    // let movies;

    await axios
      .get(`https://omdbapi.com/?apikey=${api_key}&t=${movieName}`)
      .then((data) => {
        
        setSearchMovie(data.data)
        console.log(data)
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <input type="text" value={searchMovieName} onChange={searchChange} />
        <button onClick={makeSearch}>Search</button>
      </div>
      <div className={styles.movies_list}>

 

        {  searchMovie==null ? movies.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            title={movie.Title}
            year={movie.Year}
            imdbID={movie.imdbID}
            type={movie.Type}
            poster={movie.Poster}
          />
        )) :   <MovieCard
        key={searchMovie.imdbID}
        title={searchMovie.Title}
        year={searchMovie.Year}
        imdbID={searchMovie.imdbID}
        type={searchMovie.Type}
        poster={searchMovie.Poster}
      /> }
      </div>
    </div>
  );
}

export async function getStaticProps() {
  // Fetch data from an API or other data source
  let api_key=process.env.NEXT_PUBLIC_OMDB_KEY
  let movies;

  await axios
    .get(`https://omdbapi.com/?apikey=${api_key}&s=action`)
    .then((data) => {
      movies = data.data.Search;
      // console.log(movies)
    })
    .catch((e) => {
      console.log(e);
    });

  await axios
    .get("https://omdbapi.com/?apikey=138b6a27&s=comedy")
    .then((data) => {
      movies = [...movies, ...data.data.Search];
      // console.log(movies)
    })
    .catch((e) => {
      console.log(e);
    });

  let data = movies;

  // Return the data as props
  return {
    props: {
      data,
    },
  };
}
