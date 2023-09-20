import React, { useContext } from 'react';
import { useEffect, useState } from "react";
import { FavoritesContext } from '../../Store/FavoritesContext';
import getEpisodes from '../../api/GetEpisodes/GetEpisodes';
import './style/Favorites.scss';

export default function Favorites() {
    const { favorites, setFavorites } = useContext(FavoritesContext);
    const [favoriteEpisodes, setFavoriteEpisodes] = useState([]);

    function toggleFavorite(episodeId) {
        const newFavorites = favorites.includes(episodeId) ?
            favorites.filter(fav => fav !== episodeId) :
            [...favorites, episodeId];

        setFavorites(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }

    useEffect(() => {
        if (favorites.length) {
            getEpisodes().then(allEpisodes => {
                const episodesInFavorites = allEpisodes.filter(episode => favorites.includes(episode.id));
                setFavoriteEpisodes(episodesInFavorites);
            });
        } else {
            setFavoriteEpisodes([]);
        }
    }, [favorites]);

    if (favoriteEpisodes.length === 0) {
        return <div
         className='section__padding'><h2>No favorite episodes...</h2></div>;
    }

    return (
        <div className="favorites section__padding">
            <h1>Favorite Episodes</h1>
            <ul className='cards'>
                {favoriteEpisodes.map(episode => (
                    <li key={episode.id} className="card">
                        <div className="heart" onClick={() => toggleFavorite(episode.id)}>
                            ❤️
                        </div>
                        <div><p className="cat">Name</p> {episode.name}</div>
                            <div><p className="cat">Release date</p> {episode.air_date}</div>
                            <div><p className="cat">Episode</p> {episode.episode}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}