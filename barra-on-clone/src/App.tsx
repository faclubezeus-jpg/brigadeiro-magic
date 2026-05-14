import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import InstagramFeed from './components/InstagramFeed';
import PriceCalculator from './components/PriceCalculator';
import Testimonials from './components/Testimonials';
import ContactForm from './components/ContactForm';
import WhatsAppWidget from './components/WhatsAppWidget';
import TechBackground from './components/TechBackground';
import AdminDashboard from './pages/AdminDashboard';

function HomePage() {
  return (
    <>
      <TechBackground />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Portfolio />
        <InstagramFeed />
        <PriceCalculator />
        <Testimonials />
        <ContactForm />
      </main>
      <footer className="py-12 border-t border-white/10 text-center">
        <div className="container">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} BARRA ON DIGITAL. Todos os direitos reservados. <br />
            Transformando o futuro do Araguaia.
          </p>
        </div>
      </footer>
      <WhatsAppWidget />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
