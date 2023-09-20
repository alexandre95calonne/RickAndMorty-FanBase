import './style/Header.scss'
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from 'react';

export default function Header() {
    const [showNav, setShowNav] = useState(false);
    const sidenavRef = useRef(null);
    const openBtnRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (showNav && !sidenavRef.current.contains(event.target) && !openBtnRef.current.contains(event.target)) {
                setShowNav(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNav]);

    return (
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

            <div id="mySidenav" className={`sidenav ${showNav ? 'active' : ''}`}>
                <a id="closeBtn" href="#" className="close" onClick={() => setShowNav(false)}>×</a>
                <ul>
                    <li>
                        <Link to={`/`} onClick={() => setShowNav(false)}>Home</Link>
                    </li>
                    <li>
                        <Link to={`/stats`} onClick={() => setShowNav(false)}>Stats</Link>
                    </li>
                    <li>
                        <Link to={`/random`} onClick={() => setShowNav(false)}>Random Character</Link>
                    </li>
                    <li>
                        <Link to={`/favorites`} onClick={() => setShowNav(false)}>Favorites</Link>
                    </li>
                </ul>
            </div>


            <a href="#" id="openBtn" onClick={() => setShowNav(true)}>
                <span className="burger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </a>
        </header>
    );
}
