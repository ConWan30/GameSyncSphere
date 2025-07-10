import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <header style={{ 
          backgroundColor: '#1e40af', 
          color: 'white', 
          padding: '1rem',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>GameSyncSphere</h1>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
            Revolutionary Gaming Analytics & Data Monetization Platform
          </p>
        </header>
        
        <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
