import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './styles/fonts.css';
//import ChatInterface from '../public/ChatInterface';
import LandingPage from './pages/LandingPage';
import IntegrationsPage from './pages/IntegrationsPage';
import Chat from './pages/Chat';


function App() {
  useEffect(() => {
    document.body.classList.add('loaded');
    return () => {
      document.body.classList.remove('loaded');
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        {<Route path="/chat" element={<Chat />} />}
      </Routes>
    </Router>
  );
}

export default App;