import React from 'react'
import '../styles/LandingPage.css';
import NavBar from '../components/NavBar';
import ThreeScene from '../components/ThreeScene';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';

function LandingPage() {
    const navigate = useNavigate();
    const [inputText, setInputText] = useState('');
    const [currentPlaceholder, setCurrentPlaceholder] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const placeholders = useMemo(() => [
      "Send a test email to example@gmail.com",
      "Set up a new github repo and push my code",
      "Make a motivational linkedln post",
    ], []);
  
    useEffect(() => {
      let currentIndex = 0;
      let currentCharIndex = 0;
      let isDeleting = false;
      let timeoutId: NodeJS.Timeout;
  
      const animatePlaceholder = () => {
        const currentText = placeholders[currentIndex];
        
        if (!isDeleting) {
          if (currentCharIndex <= currentText.length) {
            setCurrentPlaceholder(currentText.substring(0, currentCharIndex));
            currentCharIndex++;
            timeoutId = setTimeout(animatePlaceholder, 50);
          } else {
            isDeleting = true;
            timeoutId = setTimeout(animatePlaceholder, 100);
          }
        } else {
          if (currentCharIndex > 0) {
            setCurrentPlaceholder(currentText.substring(0, currentCharIndex - 1));
            currentCharIndex--;
            timeoutId = setTimeout(animatePlaceholder, 50);
          } else {
            isDeleting = false;
            currentIndex = (currentIndex + 1) % placeholders.length;
            timeoutId = setTimeout(animatePlaceholder, 500);
          }
        }
      };
  
      animatePlaceholder();
  
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }, [placeholders]);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (inputText.trim()) {
        navigate('/chat', { state: { initialMessage: inputText } });
      }
    };
  
    return (
      <div className="App">
        <ThreeScene />
        <div className="flow-container">
        </div>

        <NavBar isSidebarOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />


        <main className="main-content" id="home">
          <div className="hero-title">
            <span className="nex">Nex</span>
            <span className="flow">Flow</span>
          </div>
          <p className="hero-paragraph">Command your <b>next</b> vision. We execute the flow.</p>
  
          <form onSubmit={handleSubmit} className="input-container">
            <input
              type="text"
              className="landing-input"
              placeholder={currentPlaceholder}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className="landing-send-btn">
              →
            </button>
          </form>
        </main>
        <section className="about-section" id="about">
          <h2>About Us</h2>
          <div className="about-content">
            <p>We are a passionate team dedicated to bringing your creative visions to life. Our expertise lies in transforming ideas into reality through innovative solutions and cutting-edge technology. This is our website.</p>
          </div>
        </section>
      </div>
    );
  }

export default LandingPage;