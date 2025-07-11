import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import Dashboard from "./pages/Dashboard"
import PartyTest from "./pages/PartyTest"
import LandingPage from "./pages/LandingPage" // New landing page component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/party-test" element={<PartyTest />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
