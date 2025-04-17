import React, { useState } from 'react';
import '../styles/NavBar.css';

interface NavBarProps {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

const NavBar: React.FC<NavBarProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        <a href="/" className="nav-link">Home</a>
        <a href="/integrations" className="nav-link">Integrations</a>      
        <a href="/chat" className="nav-link">Chat</a>
      </div>
      
      <div 
        className={`hamburger ${isMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
      
      </div>
    </nav>
  );
};

export default NavBar;