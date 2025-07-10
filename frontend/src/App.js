import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import PartyTest from './pages/PartyTest';

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
            Revolutionary Gaming Analytics & Decentralized Communication Platform
          </p>
          
          {/* Navigation Menu */}
          <nav style={{ marginTop: '1rem' }}>
            <Link 
              to="/" 
              style={{ 
                color: 'white', 
                textDecoration: 'none', 
                margin: '0 1rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '4px'
              }}
            >
              📊 Dashboard
            </Link>
            <Link 
              to="/party-test" 
              style={{ 
                color: 'white', 
                textDecoration: 'none', 
                margin: '0 1rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '4px'
              }}
            >
              🎮 Party System Test
            </Link>
          </nav>
        </header>
        
        <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/party-test" element={<PartyTest />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
