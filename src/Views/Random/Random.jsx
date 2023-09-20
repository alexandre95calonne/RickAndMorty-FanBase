import React, { useState, useEffect } from "react";
import getAllCharacters from "../../api/GetCharacters/GetCharacters";
import './style/Random.scss'

function Random() {
    const [randomCharacter, setRandomCharacter] = useState(null);

    useEffect(() => {
        fetchRandomCharacter();
    }, []);

    async function fetchRandomCharacter() {
        const characters = await getAllCharacters();
        const randomCharacter = getRandomCharacter(characters);
        setRandomCharacter(randomCharacter);
    }

    function getRandomCharacter(characters) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        return characters[randomIndex];
    }

    if (!randomCharacter) {
        return <div>Loading...</div>;
    }

    return (
        <div className="random__container section__padding">
            <div className="card">
                <h2>Random Character</h2>
                <img src={randomCharacter.image} alt={randomCharacter.name} />
                <p>Name: {randomCharacter.name}</p>
                <p>Status: {randomCharacter.status}</p>
                <p>Species: {randomCharacter.species}</p>
                <button className="button" onClick={fetchRandomCharacter}>Refresh</button>
            </div>
        </div>
    );
}

export default Random;
