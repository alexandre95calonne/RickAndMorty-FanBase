import './style/Header.scss'
import { Link } from "react-router-dom";

export default function Header() {

    return (
        <>
            <header>
                <Link to={`/`}>
                    <img src="https://upload.wikimedia.org/wikipedia/fr/7/74/Rick_et_Morty_Logo_FR.png" alt="" />
                </Link>

                <nav>
                    <ul>
                        <li>
                            <Link to={`/`}>Home</Link>
                        </li>
                        <li>
                            <Link to={`/stats`}>Stats</Link>
                        </li>
                        <li>
                            <Link to={`/random`}>Random Character</Link>
                        </li>
                        <li>
                            <Link to={`/favorites`}>Favorites</Link>
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    )
}