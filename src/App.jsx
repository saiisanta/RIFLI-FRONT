// src/App.jsx
import NavBar from './components/modules/nav/Nav';
import Footer from './components/modules/footer/Footer';
import Hero from './components/modules/hero/Hero';
import Slider from './components/modules/slider/Slider';
import Shop from './components/modules/shop/Shop';
import Quotes from './components/modules/quotes/Quotes';

function App() {
  return (
    <>
      <NavBar />
      <Hero />
      <Slider />
      <Footer />
    </>
  );
}

export default App;
