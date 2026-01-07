import Footer from './components/common/Footer';
import Home from './pages/home/Home'
import Preloader from './components/common/Preloader';

function App() {
  return (
    <>
      <Preloader />

      <main>
        <Home />
      </main>

      <Footer />
    </>
  );
}

export default App;