import '../index.scss'
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import { FavoritesProvider } from './store/FavoritesContext';

import Header from './views/global/header/Header';

import Home from './views/Home/Home';
import Favorites from './views/Favorites/Favorites';

export default function App() {
  return (
    <FavoritesProvider>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/favorites' element={<Favorites />}></Route>
        </Routes>
      </BrowserRouter>
    </FavoritesProvider>
  );
}
