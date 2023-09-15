import { useEffect, useState } from "react"
import './style/Home.scss'
import Card from "./components/card"

export default function Home() {

    return (
        <>
            <div className="home__container section__padding">
                <h1>Welcome to the best Rick & Morty Fanbase !</h1>

                <Card />      
            </div>
        </>
    )
}