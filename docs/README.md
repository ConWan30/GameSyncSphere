# GameSyncSphere Documentation

## Overview

GameSyncSphere is a revolutionary gaming analytics and AI-powered data monetization platform that empowers players to earn money from their gaming data while providing unprecedented insights to game developers and hardware companies.

## Platform Features

### For Players
- **Earn Money**: Get paid for your gaming data and survey participation
- **Gaming Analytics**: Cross-platform insights across PC, console, and mobile
- **Wellness Monitoring**: Health insights and gaming wellness recommendations
- **Privacy Control**: Full transparency and control over your data sharing

### For Businesses
- **Real-time Insights**: Custom analytics delivered in 24 hours
- **Player Behavior Data**: Unified gaming profiles across all platforms
- **Market Research**: AI-generated surveys based on real player behavior
- **Hardware Analytics**: Real-world usage data for product development

## API Documentation

### Health Check
```
GET /health
```
Returns the current status of the GameSyncSphere API server.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-07-10T20:30:00Z",
  "version": "1.0.0",
  "message": "GameSyncSphere API is running!"
}
```

### API Test Endpoint
```
GET /api/test
```
Basic endpoint to verify API connectivity and view available features.

**Response:**
```json
{
  "message": "GameSyncSphere API is working!",
  "timestamp": "2025-07-10T20:30:00Z",
  "features": [
    "Gaming Analytics",
    "AI Survey Generation",
    "Data Monetization",
    "Wellness Monitoring"
  ]
}
```

### Player Analytics
```
GET /api/analytics/player/:playerId
```
Retrieve comprehensive analytics for a specific player.

**Parameters:**
- `playerId` (string): Unique identifier for the player

**Response:**
```json
{
  "playerId": "player123",
  "message": "Analytics endpoint ready",
  "data": {
    "totalPlaytime": "245 hours",
    "favoriteGames": ["Valorant", "Apex Legends"],
    "platforms": ["Steam", "Epic Games"],
    "wellnessScore": 7.5
  }
}
```

### AI Survey Generation
```
POST /api/survey/generate
```
Generate personalized surveys using AI based on player behavior and context.

**Request Body:**
```json
{
  "playerId": "player123",
  "gameContext": {
    "game": "valorant",
    "sessionTime": 120,
    "performance": "above_average"
  },
  "targetInsights": ["equipment_satisfaction", "wellness_state"]
}
```

**Response:**
```json
{
  "surveyId": "survey_1720648200000",
  "message": "AI survey generation ready",
  "estimatedEarnings": 25.50,
  "questions": [
    {
      "id": "q1",
      "text": "How satisfied are you with your current gaming setup?",
      "type": "rating",
      "earningValue": 8.50
    }
  ]
}
```

## Getting Started

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/ConWan30/GameSyncSphere.git
cd GameSyncSphere

# Install all dependencies
npm run install:all
```

### 2. Development
```bash
# Start both backend and frontend
npm run dev

# Or start individually
npm run dev:backend  # Backend only
npm run dev:frontend # Frontend only
```

### 3. Testing
```bash
# Run all tests
npm test

# Test individual components
npm run test:backend
npm run test:frontend
```

### 4. Building
```bash
# Build for production
npm run build
```

### 5. Deployment
```bash
# Deploy to Railway
npm run deploy
```

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Real-time**: Socket.io
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Jest, Supertest

### Frontend
- **Framework**: React 18+
- **Routing**: React Router
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Testing**: React Testing Library

### Infrastructure
- **Deployment**: Railway
- **CI/CD**: GitHub Actions
- **Monitoring**: Built-in health checks
- **Configuration**: Environment variables

## Environment Variables

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# API Keys (obtain from respective services)
STEAM_API_KEY=your_steam_api_key
FITBIT_CLIENT_ID=your_fitbit_client_id
OPENAI_API_KEY=your_openai_api_key
CLAUDE_API_KEY=your_claude_api_key

# Security
JWT_SECRET=your_secure_jwt_secret
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001
```

## Project Structure

```
GameSyncSphere/
├── backend/                 # Node.js API server
│   ├── src/
│   │   └── server.js       # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── App.js         # Main App component
│   │   ├── App.css        # Styling
│   │   └── pages/         # Page components
│   ├── public/
│   │   └── index.html     # HTML template
│   └── package.json       # Frontend dependencies
├── docs/                  # Documentation
│   ├── README.md          # This file
│   ├── api-innovations.md # API innovations
│   └── business-model.md  # Business model
├── .github/
│   └── workflows/
│       └── deploy.yml     # CI/CD pipeline
├── railway.json           # Railway configuration
└── package.json          # Root package file
```

## API Endpoints Reference

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/health` | Server health check | ✅ Live |
| GET | `/api/test` | API connectivity test | ✅ Live |
| GET | `/api/analytics/player/:id` | Player analytics | ✅ Demo |
| POST | `/api/survey/generate` | AI survey generation | ✅ Demo |
| GET | `/api/wellness/monitor/:id` | Wellness monitoring | 🔄 Coming Soon |
| POST | `/api/monetization/earnings` | Player earnings | 🔄 Coming Soon |
| GET | `/api/b2b/insights/custom` | Custom B2B insights | 🔄 Coming Soon |

## Error Handling

### Standard Error Response
```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "timestamp": "2025-07-10T20:30:00Z"
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `429` - Rate Limited
- `500` - Internal Server Error

## Rate Limiting

- **Default**: 1000 requests per 15 minutes per IP
- **Authenticated**: Higher limits for registered users
- **Enterprise**: Custom rate limits available

## Contributing

Please read our contributing guidelines before submitting pull requests:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

- **GitHub Issues**: [Create an issue](https://github.com/ConWan30/GameSyncSphere/issues)
- **Documentation**: Check our [docs folder](docs/)
- **API Reference**: This document

## License

MIT License - see [LICENSE](../LICENSE) file for details.

---

**🎮 Building the future of gaming analytics, one API call at a time!**
