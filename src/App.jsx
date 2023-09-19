import '../index.scss'
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import { FavoritesProvider } from './Store/FavoritesContext';

import Header from './Views/Global/Header/Header';

import Home from './Views/Home/Home';
import Favorites from './Views/Favorites/Favorites';
import Stats from './Views/Stats/Stats';
import Random from './Views/Random/Random';

export default function App() {
  return (
    <FavoritesProvider>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/favorites' element={<Favorites />}></Route>
          <Route path='/stats' element={<Stats />}></Route>
          <Route path='/random' element={<Random />}></Route>
        </Routes>
      </BrowserRouter>
    </FavoritesProvider>
  );
}
