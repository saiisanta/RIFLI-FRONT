import Hero from './components/hero/Hero';
import Slider from './components/slider/Slider';
import ServicesShowcase from './components/servicesShowcase/ServicesShowcase';

export default function Home() {
  return (
    <>
      <Hero />
      <Slider />
      <ServicesShowcase />
    </>
  );
}