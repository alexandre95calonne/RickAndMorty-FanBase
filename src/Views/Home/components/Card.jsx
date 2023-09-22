import React, { useContext, useEffect, useState, useRef } from "react";
import { FavoritesContext } from '../../../Store/FavoritesContext';
import fetchAllEpisodes from "../../../api/GetEpisodes/GetEpisodes";
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
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [showPopup, setShowPopup] = useState(false);
    const [popupEpisodeId, setPopupEpisodeId] = useState(null);
    const popupContentRef = useRef(null);

    // function allow to know wich filter have been selected

    const handleFilterClick = (filter) => {
        filterEpisodes(filter);
        setSelectedFilter(filter);
    }

    // function allow to know when user click outside of pop-up element 

    const handleOutsideClick = (event) => {
        if (popupContentRef.current && !popupContentRef.current.contains(event.target)) {
            setShowPopup(false);
        }
    };

    // function allow to know how much pages we need. Math.ceil around to int up. If "All" pages will equal length allEpisodes otherwise it will equal length of the filter selected. Finally we divise by the number of episodes per page

    const totalPages = Math.ceil(
        (currentSeason === 'All' ? allEpisodes.length : filteredEpisodes.length) / PAGE_SIZE
    );

    

    function toggleFavorite(episodeId) {
        const newFavorites = favorites.includes(episodeId) ?
            favorites.filter(fav => fav !== episodeId) :
            [...favorites, episodeId];

        setFavorites(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }

    function handleButtonClick(episodeId, characterUrls) {
        if (buttonText[episodeId] === "Hide Characters") {
            setSelectedCharacters(prev => ({ ...prev, [episodeId]: [] }));
            setShowPopup(false);
            setPopupEpisodeId(null);
        } else {
            const characterPromises = characterUrls.map(url => fetch(url).then(res => res.json()));
            Promise.all(characterPromises)
                .then(characters => setSelectedCharacters(prev => ({ ...prev, [episodeId]: characters })));
            setShowPopup(true);
            setPopupEpisodeId(episodeId);
        }
    }


    function filterEpisodes(season) {
        setCurrentSeason(season);
        setCurrentPage(1);
    }



    useEffect(() => {
        async function fetchDataAndFilter() {
            try {
                const allEpisodesData = await fetchAllEpisodes();
                setAllEpisodes(allEpisodesData);

                const filtered = currentSeason === 'All' ?
                    allEpisodesData :
                    allEpisodesData.filter(episode => episode.episode.startsWith(currentSeason));

                const start = (currentPage - 1) * PAGE_SIZE;
                const end = start + PAGE_SIZE;

                setFilteredEpisodes(filtered.slice(start, end));

                const initialButtonText = {};
                filtered.forEach(episode => initialButtonText[episode.id] = "Show Characters");

                setLoading(false);

            } catch (error) {
                console.error('Une erreur est survenue :', error);
            }
        }

        fetchDataAndFilter();
    }, [currentSeason, currentPage]);

    // If data isn't fetching we return "Loading..."

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="card__container">
            <div className="filter-container">
                {['All', 'S01', 'S02', 'S03', 'S04', 'S05'].map(filter => (
                    <button
                        key={filter}
                        onClick={() => handleFilterClick(filter)}
                        className={filter === selectedFilter ? 'selected' : ''}
                    >
                        {filter === 'All' ? 'All' : `Season : ${filter.slice(1)}`}
                    </button>
                ))}
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
                            <button onClick={() => handleButtonClick(episode.id, episode.characters)}>Show characters</button>
                        </li>
                    );
                })}
            </ul>
            {showPopup && (
                <div className="popup" onClick={handleOutsideClick}>
                    <div className="popup-content" ref={popupContentRef}>
                        <h2>Characters in : {filteredEpisodes.find(episode => episode.id === popupEpisodeId)?.name}</h2>
                        <ul className="popup-characters">
                            {selectedCharacters[popupEpisodeId]?.map((character) => (
                                <li key={character.id}>
                                    {character.name} ({character.gender}/{character.species})
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setShowPopup(false)}>Close</button>
                    </div>
                </div>
            )}
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