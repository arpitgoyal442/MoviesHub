// components/MovieCard.js
import React from 'react';
import styles from '../styles/moviecard.module.css';
import { useRouter } from 'next/router';

const MovieCard = ({ title, year, imdbID, type, poster }) => {

  let myRouter=useRouter()

  function movieClicked(){
    myRouter.push(`/movies/${imdbID}`)
  }

  return (
    <div onClick={movieClicked} className={styles.movieCard}>
      <img src={poster} alt={title} className={styles.poster} />
      <div className={styles.movieInfo}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.year}>{year}</p>
        <p className={styles.imdbID}>IMDb ID: {imdbID}</p>
        <p className={styles.type}>{type}</p>
      </div>
    </div>
  );
};

export default MovieCard;
