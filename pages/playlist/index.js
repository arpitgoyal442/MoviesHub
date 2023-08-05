import React, { useState, useEffect } from "react";
import axios from "axios";

import MovieCard from "../../components/movieCard";
import styles from "../../styles/playlist.module.css";

import Loader from "../../components/loader"

const PlaylistPage = () => {
  const [newPlaylist, setNewPlaylist] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [movies, setMovies] = useState([]);
  const [playlistSelected, setPlaylistSelected] = useState(null);

  const [playlists, setPlaylists] = useState([]);
  const [playlistLink,setPlaylistLink]=useState("");

  const [loadermsg,setLoaderMsg]=useState("");
  const [showloader,setShowLoader]=useState(false)

  let URL=  process.env.NEXT_PUBLIC_SITE_URL

  async function fetchPlaylists() {
    let jwt_token = localStorage.getItem("jwt_token");
    let userid = localStorage.getItem("userid");

    

    // Get all the playlists of the user

    await axios
      .get(`${URL}/api/playlist`, {
        headers: {
          Authorization: `Bearer ${jwt_token}`,
          "X-User-ID": userid,
        },
      })
      .then((data) => {
        console.log(data.data);
        setPlaylists((pre) => {
          return [...data.data];
        });

        console.log(playlists);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    // fetch all the playlists and set to playlists-useState
    fetchPlaylists();
  }, []);

  const handleCheckboxChange = (event) => {
    setIsPrivate(event.target.checked);
  };

  async function createNewPlaylist() {

    setLoaderMsg("Adding...")
    setShowLoader(true)

    let jwt_token=localStorage.getItem("jwt_token")
    let userid=localStorage.getItem("userid")

    if(jwt_token==null || jwt_token==""||userid==null || userid=="")
    {
      setLoaderMsg("Login Required...")
       setShowLoader(false)
      
      return
    }

    if (newPlaylist == "") {
      setLoaderMsg("Enter a valid name")
       setShowLoader(false)
      console.log("Empty name not allowed");
      // return;
    } else {
      console.log("is Private is :" + isPrivate);

      await axios
        .post(`${URL}/api/playlist`, {
          name: newPlaylist,
          ownerId: localStorage.getItem("userid"),
          isPublic: !isPrivate,
        })
        .then((data) => {
          console.log(data);
          setLoaderMsg("Added Successfully")
            setShowLoader(false)
          setPlaylists((pre) => {
            return [...pre, data.data];
          });
        })
        .catch((e) => {
          setLoaderMsg("Something went Wrong")
          setShowLoader(false)
          console.log(e);
        });
    }
  }

  function handlePlaylistClicked(e) {
   

    if (playlistSelected != null) {
      playlistSelected.style.color = "black";
    }
    setPlaylistSelected(e.target);
    e.target.style.color = "teal";

    console.log(playlistSelected)

    let index = e.target.getAttribute("value");

    let link= playlists[index].ispublic?`${URL}/playlist/${playlists[index]._id}`:"Private Playlist"

    setPlaylistLink(link)

    setMovies(() => {
      return [...playlists[index].movies];
    });
  }

  

  return (
    <div className={styles.container}>
      <Loader message={loadermsg} show={showloader}/>
      <div className={styles.leftPanel}>
        <h1>Playlist Names</h1>
        <ul>
          <div className={styles.playlistform}>
            <input
              type="text"
              placeholder="Name.."
              value={newPlaylist}
              onChange={(e) => {
                setNewPlaylist(e.target.value);
              }}
            />
            <label>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={handleCheckboxChange}
              />
              Private
            </label>
            <button onClick={createNewPlaylist}>Create</button>
          </div>

           <div className={styles.alllists}>
          {playlists.map((playlist, index) => (
            <div className={styles.listContainer}>
            <li
              key={playlist._id}
              value={index}
              onClick={handlePlaylistClicked}
            >
              {playlist.name}
              
              
            </li>
            
             <img  value={index} src={playlist.ispublic?"":"/images/private_icon.png"}  alt="" /> 
           
            </div>
            
          ))}

</div>
        </ul>
      </div>

      <div className={styles.rightPanel}>
      {playlistLink!=""&&<p className={styles.playlistLink}>{playlistLink}</p>}
        <div className={styles.moviesContainer}>
          
          {movies.map((movie) => (
            <MovieCard
            key={movie.imdbID}
              title={movie.title}
              year={movie.year}
              imdbID={movie.imdbId}
              type={movie.movietype}
              poster={movie.poster}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
