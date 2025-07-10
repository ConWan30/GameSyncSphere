import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PartyTest = () => {
  const [parties, setParties] = useState([]);
  const [currentParty, setCurrentParty] = useState(null);
  const [playerId] = useState(`player_${Math.random().toString(36).substr(2, 9)}`);

  const API_URL = 'https://gamesyncsphere-production.up.railway.app';

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/party/discover?playerId=${playerId}`);
      setParties(response.data.availableParties);
    } catch (error) {
      console.error('Error fetching parties:', error);
    }
  };

  const createParty = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/party/create`, {
        creatorId: playerId,
        gameContext: { game: 'valorant', mode: 'ranked' },
        maxPlayers: 4,
        partyName: 'Test Valorant Party'
      });
      
      setCurrentParty(response.data.party);
      fetchParties();
      alert('Party created successfully!');
    } catch (error) {
      console.error('Error creating party:', error);
    }
  };

  const joinParty = async (partyId) => {
    try {
      const response = await axios.post(`${API_URL}/api/party/join`, {
        partyId,
        playerId,
        playerName: `Player ${playerId.slice(-4)}`
      });
      
      setCurrentParty(response.data.party);
      fetchParties();
      alert('Joined party successfully!');
    } catch (error) {
      console.error('Error joining party:', error);
      alert(error.response?.data?.error || 'Failed to join party');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        🎮 GameSyncSphere Party System Test
      </h2>

      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
        <h3>Your Player ID: {playerId}</h3>
        <p>Test the revolutionary decentralized party system!</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={createParty}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
        >
          🎯 Create Valorant Party
        </button>
        
        <button 
          onClick={fetchParties}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          🔍 Refresh Parties
        </button>
      </div>

      {currentParty && (
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#dcfce7',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: '#166534' }}>🎉 Current Party: {currentParty.partyName}</h3>
          <p><strong>Party ID:</strong> {currentParty.id}</p>
          <p><strong>Game:</strong> {currentParty.gameContext.game}</p>
          <p><strong>Players:</strong> {currentParty.members.length}/{currentParty.maxPlayers}</p>
          <p><strong>Status:</strong> {currentParty.status}</p>
          <p style={{ fontSize: '0.9rem', color: '#166534' }}>
            ✨ WebRTC P2P connections would be established here for voice/video chat!
          </p>
        </div>
      )}

      <div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          🌐 Available Parties ({parties.length})
        </h3>
        
        {parties.length === 0 ? (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            color: '#6b7280'
          }}>
            <p>No parties available. Be the first to create one! 🚀</p>
          </div>
        ) : (
          parties.map(party => (
            <div key={party.id} style={{
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              marginBottom: '1rem',
              backgroundColor: 'white'
            }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                {party.partyName}
              </h4>
              <p><strong>Game:</strong> {party.gameContext.game}</p>
              <p><strong>Players:</strong> {party.currentPlayers}/{party.maxPlayers}</p>
              <p><strong>Created:</strong> {new Date(party.createdAt).toLocaleTimeString()}</p>
              
              <button 
                onClick={() => joinParty(party.id)}
                style={{
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                🎮 Join Party
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PartyTest;
