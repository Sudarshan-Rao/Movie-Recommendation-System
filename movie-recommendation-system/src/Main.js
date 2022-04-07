import {useEffect, useState} from "react"
import axios from 'axios'
import { Movie } from "./components/Movie"
import './App.css'
import ReactStars from "react-rating-stars-component";
import img from './images/Purdue.png';
import styled from "styled-components";

export function Main(props) {
    const Logo = styled.div`
    width: 80px;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-image: url(${img});
    background-size: contain; /* or contain depending on what you want */
    background-position: right;
    background-repeat: no-repeat;
    z-index: 10;
    `;

    const MOVIE_API = "https://api.themoviedb.org/3/"
    const SEARCH_API = MOVIE_API + "search/movie"
    const DISCOVER_API = MOVIE_API + "discover/movie"
    const API_KEY = "d5d33d6d9e90174e8bd3cfeaade791a9"
    const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280"

    const [playing, setPlaying] = useState(false)
    const [trailer, setTrailer] = useState(null)
    const [movies, setMovies] = useState([])
    const [searchKey, setSearchKey] = useState("")
    const [movie, setMovie] = useState({title: "Loading Movies"})
    const [rating, setRating] =  useState();

    const ratingChanged = (newRating) => {
        console.log(newRating);
        setRating(newRating)
      };

    useEffect(() => {
        fetchMovies()
    }, [])

    const fetchMovies = async (event) => {
        if (event) {
            event.preventDefault()
        }

        const {data} = await axios.get(`${searchKey ? SEARCH_API : DISCOVER_API}`, {
            params: {
                api_key: API_KEY,
                query: searchKey
            }
        })

        console.log(data.results[4])
        setMovies(data.results)
        setMovie(data.results[4])

        if (data.results.length) {
            await fetchMovie(data.results[4].id)
        }
    }

    const fetchMovie = async (id) => {
        const {data} = await axios.get(`${MOVIE_API}movie/${id}`, {
            params: {
                api_key: API_KEY,
                append_to_response: "videos"
            }
        })

        if (data.videos && data.videos.results) {
            const trailer = data.videos.results.find(vid => vid.name === "Official Trailer")
            setTrailer(trailer ? trailer : data.videos.results[0])
        }

        setMovie(data)
    }


    const selectMovie = (movie) => {
        fetchMovie(movie.id)
        setPlaying(false)
        setMovie(movie)
        window.scrollTo(0, 0)
    }

    const renderMovies = () => (
        movies.map(movie => (
            <Movie
                selectMovie={selectMovie}
                key={movie.id}
                movie={movie}
            />
        ))
    )

    return (
        <div className="App">
            <header className="center-max-size header"style={{background: `linear-gradient(58deg,rgba(241, 196, 15, 1) 20%, rgba(243, 172, 18, 1) 100%)`}}>
            <Logo></Logo>
                <span className={"brand"}><h2>Movie Recommendation System</h2></span>
                <form className="form" onSubmit={fetchMovies}>
                    <input className="search" type="text" id="search" placeholder="Search Movies"
                           onInput={(event) => setSearchKey(event.target.value)}/>
                    <button className="submit-search" type="submit"><i className="fa fa-search"></i></button>
                </form>
            </header>
            {movies.length ?
                <main>
                    {movie ?
                        <div className="poster"
                             style={{backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${BACKDROP_PATH}${movie.backdrop_path})`}}>
                            {playing ?
                                <>
                                    <button onClick={() => setPlaying(false)} className={"button close-video"}>Close
                                    </button>
                                </> :
                                <div className="center-max-size">
                                    <div className="poster-content">
                                        <h1>{movie.title}</h1>
                                        <p>{movie.overview}</p>
                                        <ReactStars
                                            className="rating"
                                            count={10}
                                            isHalf={true}
                                            onChange={ratingChanged}
                                            size={24}
                                            activeColor="#ffd700"
                                        />
                                    </div>
                                </div>
                            }
                        </div>
                        : null}

                    <div className={"center-max-size container"}>
                        {renderMovies()}
                    </div>
                </main>
                : 'Sorry, no movies found'}
        </div>
    );
}