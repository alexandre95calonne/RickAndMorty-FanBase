import { useEffect, useState } from "react"
import '../../../api/GetEpisodes/GetEpisodes'

export default function Card() {

    const [episodes, setEpisodes] = useState([]);

    useEffect(() => {
        getEpisodes().then((data) => {
            setEpisodes(data);
        });
    }, []);

    return (
        <>
            <p>cc</p>

            <div>
                    <ul>
                        {episodes.map(episode => (
                            <li key={episode.id}>{episode.name}</li>
                        ))}
                    </ul>
                </div>
        </>
    )
}