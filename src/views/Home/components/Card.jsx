import React, { useContext, useEffect, useState } from "react";
import { FavoritesContext } from '../../../store/FavoritesContext';
import getEpisodes from '../../../api/GetEpisodes/GetEpisodes';
import './style/Card.scss';

export default function Card() {
    const { favorites, setFavorites } = useContext(FavoritesContext);
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [selectedCharacters, setSelectedCharacters] = useState({});
    const [buttonText, setButtonText] = useState({});

    function toggleFavorite(episodeId) {
        const newFavorites = favorites.includes(episodeId) ? 
            favorites.filter(fav => fav !== episodeId) : 
            [...favorites, episodeId];
        
        setFavorites(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }

    function handleButtonClick(episodeId, characterUrls) {
        if (buttonText[episodeId] === "Hide Characters") {
            setButtonText(prev => ({ ...prev, [episodeId]: "Show Characters" }));
            setSelectedCharacters(prev => ({ ...prev, [episodeId]: [] }));
        } else {
            setButtonText(prev => ({ ...prev, [episodeId]: "Hide Characters" }));
            const characterPromises = characterUrls.map(url => fetch(url).then(res => res.json()));
            Promise.all(characterPromises)
                .then(characters => setSelectedCharacters(prev => ({ ...prev, [episodeId]: characters })));
        }
    }

    useEffect(() => {
        getEpisodes(page).then((data) => {
            setData(data);
            const initialButtonText = {};
            data.results.forEach(episode => initialButtonText[episode.id] = "Show Characters");
            setButtonText(initialButtonText);
        });
    }, [page]);

    if (!data) {
        return <div>Loading...</div>;
    }

    const pageNumbers = Array.from({ length: data.info.pages }, (_, i) => i + 1);

    return (
        <div className="card__container">
            <ul className="cards">
                {data.results.map((episode) => {
                    const isFavorite = favorites.includes(episode.id);

                    return (
                        <li key={episode.id} className="card">
                            <div onClick={() => toggleFavorite(episode.id)} className="heart">
                                {isFavorite ? '❤️' : '♡'}
                            </div>
                            <div><p>Name :</p> {episode.name}</div>
                            <div><p>Release date :</p> {episode.air_date}</div>
                            <div><p>Episode :</p> {episode.episode}</div>
                            <button onClick={() => handleButtonClick(episode.id, episode.characters)}>{buttonText[episode.id]}</button>
                            <div className="characters__container">
                                <ul className="characters">
                                    {selectedCharacters[episode.id]?.map((character) => (
                                        <li key={character.id}>
                                            <div>{character.name} ({character.gender}/{character.species})</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <div>
                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => setPage(number)}
                        disabled={number === page}
                    >
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
}
