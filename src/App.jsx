import Footer from './components/modules/footer/Footer';
import Hero from './components/modules/hero/Hero';
import Slider from './components/modules/slider/Slider';
import ServicesShowcase from './components/modules/ServicesShowcase/ServicesShowcase';
import Preloader from './components/modules/preloader/Preloader';

function App() {
  return (
    <>
      <Preloader />

      <main>
        <Hero />
        <Slider />
        <ServicesShowcase/>
      </main>

      <Footer />
    </>
  );
}

export default App;