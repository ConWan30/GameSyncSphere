import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [apiStatus, setApiStatus] = useState('checking...');
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    const checkAPI = async () => {
      try {
        const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        const response = await axios.get(`${baseURL}/api/test`);
        setApiStatus('connected ✅');
        setApiData(response.data);
        console.log('API Response:', response.data);
      } catch (error) {
        setApiStatus('disconnected ❌');
        console.error('API Error:', error);
      }
    };

    checkAPI();
  }, []);

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '1.5rem',
    margin: '1rem 0'
  };

  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem'
  };

  return (
    <div>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        GameSyncSphere Dashboard
      </h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {/* API Status Card */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            API Status
          </h3>
          <p>Backend connection: {apiStatus}</p>
          {apiData && (
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
              <p>Message: {apiData.message}</p>
              <p>Features: {apiData.features?.join(', ')}</p>
            </div>
          )}
        </div>

        {/* Gaming Analytics Card */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Gaming Analytics
          </h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Cross-platform gaming insights and performance tracking
          </p>
          <button style={buttonStyle}>
            View Analytics
          </button>
        </div>

        {/* Data Monetization Card */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Data Monetization
          </h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Earn money from your gaming data and survey participation
          </p>
          <button style={{ ...buttonStyle, backgroundColor: '#10b981' }}>
            View Earnings
          </button>
        </div>
      </div>

      {/* Implementation Progress */}
      <div style={{
        marginTop: '2rem',
        backgroundColor: '#fef3c7',
        borderLeft: '4px solid #f59e0b',
        padding: '1rem'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#92400e' }}>
          Implementation Progress
        </h3>
        <ul style={{ marginTop: '0.5rem', color: '#78350f' }}>
          <li>✅ Basic server setup</li>
          <li>✅ Frontend foundation</li>
          <li>✅ API health monitoring</li>
          <li>⏳ Gaming API integrations (Steam, Xbox, PlayStation)</li>
          <li>⏳ AI survey generation system</li>
          <li>⏳ Data monetization platform</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
