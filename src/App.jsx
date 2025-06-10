import { useState } from 'react'
import './App.css'
import NavBar from './components/modules/nav/Nav.jsx'
import Hero from './components/modules/hero/Hero.jsx'
import Slider from './components/modules/slider/Slider.jsx'
import Services from './components/modules/Services/Services.jsx'
import Shop from './components/modules/shop/Shop.jsx'
//import Libros from './components/usuarios/Usuarios.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div style={{ margin: 0, padding: 0 }}>
        <NavBar/>
        <Hero />
        <Slider />
        <Shop />
        <Services/>
      </div>
    </>
  )
}

export default App;
