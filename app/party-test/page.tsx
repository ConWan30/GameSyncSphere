"use client"

import { useState, useEffect } from "react"
import axios from "axios"

// Convert your existing PartyTest component to Next.js page
export default function PartyTest() {
  const [parties, setParties] = useState([])
  const [currentParty, setCurrentParty] = useState(null)
  const [playerId] = useState(`player_${Math.random().toString(36).substr(2, 9)}`)

  const API_URL = "https://gamesyncsphere-production.up.railway.app"

  useEffect(() => {
    fetchParties()
  }, [])

  const fetchParties = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/party/discover?playerId=${playerId}`)
      setParties(response.data.availableParties)
    } catch (error) {
      console.error("Error fetching parties:", error)
    }
  }

  const createParty = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/party/create`, {
        creatorId: playerId,
        gameContext: { game: "valorant", mode: "ranked" },
        maxPlayers: 4,
        partyName: "Test Valorant Party",
      })

      setCurrentParty(response.data.party)
      fetchParties()
      alert("Party created successfully!")
    } catch (error) {
      console.error("Error creating party:", error)
    }
  }

  const joinParty = async (partyId: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/party/join`, {
        partyId,
        playerId,
        playerName: `Player ${playerId.slice(-4)}`,
      })

      setCurrentParty(response.data.party)
      fetchParties()
      alert("Joined party successfully!")
    } catch (error) {
      console.error("Error joining party:", error)
      alert(error.response?.data?.error || "Failed to join party")
    }
  }

  return (
    <div className="min-h-screen bg-charcoal text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 holographic-text">🎮 GameSyncSphere Party System Test</h1>

        <div className="holographic-card p-6 mb-8">
          <h3 className="text-xl font-semibold mb-2">Your Player ID: {playerId}</h3>
          <p className="text-gray-300">Test the revolutionary decentralized party system!</p>
        </div>

        <div className="flex gap-4 mb-8">
          <button onClick={createParty} className="holographic-button px-6 py-3 text-white">
            🎯 Create Valorant Party
          </button>

          <button onClick={fetchParties} className="holographic-button px-6 py-3 text-white bg-green-600">
            🔍 Refresh Parties
          </button>
        </div>

        {currentParty && (
          <div className="holographic-card p-6 mb-8 border-green-500/30">
            <h3 className="text-xl font-semibold text-green-400 mb-4">🎉 Current Party: {currentParty.partyName}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                <strong>Party ID:</strong> {currentParty.id}
              </p>
              <p>
                <strong>Game:</strong> {currentParty.gameContext.game}
              </p>
              <p>
                <strong>Players:</strong> {currentParty.members.length}/{currentParty.maxPlayers}
              </p>
              <p>
                <strong>Status:</strong> {currentParty.status}
              </p>
            </div>
            <p className="text-green-400 text-sm mt-4">
              ✨ WebRTC P2P connections would be established here for voice/video chat!
            </p>
          </div>
        )}

        <div>
          <h3 className="text-2xl font-semibold mb-6">🌐 Available Parties ({parties.length})</h3>

          {parties.length === 0 ? (
            <div className="holographic-card p-8 text-center">
              <p className="text-gray-400">No parties available. Be the first to create one! 🚀</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {parties.map((party: any) => (
                <div key={party.id} className="holographic-card p-6">
                  <h4 className="text-lg font-semibold mb-2">{party.partyName}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <p>
                      <strong>Game:</strong> {party.gameContext.game}
                    </p>
                    <p>
                      <strong>Players:</strong> {party.currentPlayers}/{party.maxPlayers}
                    </p>
                    <p>
                      <strong>Created:</strong> {new Date(party.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => joinParty(party.id)}
                    className="holographic-button px-4 py-2 text-white bg-purple-600"
                  >
                    🎮 Join Party
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
