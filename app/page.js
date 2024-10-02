'use client';
import Hero from "./landing/Hero";
import Feature from "./landing/Feature";
import Header from "./landing/Layout/Header";
import Footer from "./landing/Layout/Footer";
import { useState, useEffect } from 'react';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    setIsDarkMode(storedTheme === 'dark');
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
  };

  return (
    
    <div className={isDarkMode ? 'dark' : ''}>
      <div className={' bg-white-500 dark:bg-dark-100'}>
        <Header toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
        />
        <Hero />
        <Feature />
        <Footer isDarkMode={isDarkMode} />
      </div>
        
    </div>
  );
}
