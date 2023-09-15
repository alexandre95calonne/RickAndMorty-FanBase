import '../index.scss'
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import Header from './views/global/header/Header'

import Home from './views/Home/Home'

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App