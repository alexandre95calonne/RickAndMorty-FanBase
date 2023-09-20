import React, { useEffect, useState } from 'react';
import getAllCharacters from '../../api/GetCharacters/GetCharacters';
import './Style/Stats.scss'

function Stats() {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const allCharacters = await getAllCharacters();
            setCharacters(allCharacters);
            setLoading(false);
        }

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const statusCounts = characters.reduce((acc, character) => {
        acc[character.status] = (acc[character.status] || 0) + 1;
        return acc;
    }, {});

    const rickAndMortyDerived = characters.filter(character =>
        character.name.toLowerCase().includes('rick') || character.name.toLowerCase().includes('morty')
    ).length;

    const speciesCounts = characters.reduce((acc, character) => {
        acc[character.species] = (acc[character.species] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className='section__padding'>
            <h1>Statistics</h1>
            <table>
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(statusCounts).map(([status, count]) => (
                        <tr key={status}>
                            <td>{status}</td>
                            <td className='count'>{count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <table>
                <thead>
                    <tr>
                        <th>Species</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(speciesCounts).map(([species, count]) => (
                        <tr key={species}>
                            <td className='species'>{species}</td>
                            <td className='count'>{count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <p><i> Number of characters derived from Rick and Morty: {rickAndMortyDerived}</i></p>
        </div>
    );
}

export default Stats;
