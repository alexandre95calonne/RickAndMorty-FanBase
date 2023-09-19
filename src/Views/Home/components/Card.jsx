import React, { useContext, useEffect, useState } from "react";
import { FavoritesContext } from '../../../Store/FavoritesContext';
import './style/Card.scss';

const PAGE_SIZE = 20;

export default function Card() {
    const { favorites, setFavorites } = useContext(FavoritesContext);
    const [allEpisodes, setAllEpisodes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSeason, setCurrentSeason] = useState('All');
    const [filteredEpisodes, setFilteredEpisodes] = useState([]);
    const [selectedCharacters, setSelectedCharacters] = useState({});
    const [buttonText, setButtonText] = useState({});
    const [loading, setLoading] = useState(true);

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

    function filterEpisodes(season) {
        setCurrentSeason(season);
        setCurrentPage(1);
    }

    useEffect(() => {
        async function fetchDataAndFilter() {
            try {
                const response = await fetch('https://rickandmortyapi.com/api/episode');
                const data = await response.json();
                const totalPages = data.info.pages;
                const allEpisodes = await Promise.all(
                    Array.from({ length: totalPages }, (_, i) => i + 1)
                        .map(page => fetch(`https://rickandmortyapi.com/api/episode?page=${page}`)
                            .then(res => res.json())
                            .then(data => data.results)
                        )
                );
                const flatEpisodes = allEpisodes.flat();
                setAllEpisodes(flatEpisodes);
                const filtered = currentSeason === 'All' ?
                    flatEpisodes :
                    flatEpisodes.filter(episode => episode.episode.startsWith(currentSeason));
                const start = (currentPage - 1) * PAGE_SIZE;
                const end = start + PAGE_SIZE;
                setFilteredEpisodes(filtered.slice(start, end));
                const initialButtonText = {};
                filtered.forEach(episode => initialButtonText[episode.id] = "Show Characters");
                setButtonText(initialButtonText);
                setLoading(false);
            } catch (error) {
                console.error('Une erreur est survenue :', error);
            }
        }

        fetchDataAndFilter();
    }, [currentSeason, currentPage]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const totalPages = Math.ceil(
        (currentSeason === 'All' ? allEpisodes.length : filteredEpisodes.length) / PAGE_SIZE
    );

    return (
        <div className="card__container section__padding">
            <div className="filter-container">
                <button onClick={() => filterEpisodes('All')}>Tout</button>
                <button onClick={() => filterEpisodes('S01')}>Saison 1</button>
                <button onClick={() => filterEpisodes('S02')}>Saison 2</button>
                <button onClick={() => filterEpisodes('S03')}>Saison 3</button>
                <button onClick={() => filterEpisodes('S04')}>Saison 4</button>
                <button onClick={() => filterEpisodes('S05')}>Saison 5</button>
            </div>
            <ul className="cards">
                {filteredEpisodes.map((episode) => {
                    const isFavorite = favorites.includes(episode.id);

                    return (
                        <li key={episode.id} className="card">
                            <div onClick={() => toggleFavorite(episode.id)} className="heart">
                                {isFavorite ? '❤️' : '♡'}
                            </div>
                            <div><p className="cat">Name</p> {episode.name}</div>
                            <div><p className="cat">Release date</p> {episode.air_date}</div>
                            <div><p className="cat">Episode</p> {episode.episode}</div>
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
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        disabled={number === currentPage}
                    >
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
}