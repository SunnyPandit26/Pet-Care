import { BrowserRouter as Router , Routes, Route, } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./sections/Footer"
import Hero from "./sections/Hero"
import Problem from "./sections/Problem"
import Solution from "./sections/Solution"
import Features from "./sections/Features"
// import Innovation from "./sections/Innovation"
// import Impact from "./sections/Impact"
// import FutureScope from "./sections/FutureScope"
// import HowItWorks from "./components/HowItWorks"
import HowQR from "./components/howQR"
import DogDetails from "./components/DogDetails"
import QRCodeGenerator from "./components/QRCodeGenerator"
import QRPage from "./components/QRPage"
import DogProfile from './pages/DogProfile'
import DogCareAI from './pages/DogCareAI'
// import EmergencyRescue from './pages/EmergencyRescue'
// import EmergencyDogRescue from './pages/EmergencyDogRescue'
import EmergencyRescueSystem from './pages/EmergencyRescueSystem'
import NearbyVets from './sections/NearbyVets'
import NGOSection from './components/NGOSection'
// import VaccinationDashboard from './pages/VaccinationDashboard'



function LandingPage() {
  return (
    <div className="min-h-screen bg-pastel-cream overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        {/* <HowItWorks /> */}
        
        <Features />
        {/* <Innovation /> */}
        <HowQR />
          <NGOSection /> 
        {/* <Impact /> */}
        {/* <FutureScope /> */}
        <NearbyVets/>
    
      </main>
      <Footer />
    </div>
  )
}

function SolutionPage() {
  return (
    <div className="min-h-screen bg-pastel-cream overflow-x-hidden">
      <Navbar />
      <main>
        <Solution />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/solution" element={<SolutionPage />} />
        <Route path="/pet/:dogId" element={<DogProfile />} /> 
        <Route path="/detection" element={<DogCareAI />} />
        {/* <Route path="/emergency-rescue" element={<EmergencyRescue />} />
        <Route path="/emergency-dog-rescue" element={<EmergencyDogRescue />} /> */}
        <Route path="/emergency" element={<EmergencyRescueSystem />} />
        <Route path="/generate" element={<QRCodeGenerator />} />
        <Route path="/qr" element={<QRPage />} />
        {/* <Route path="/vaccination-tracker" element={<VaccinationDashboard />} /> */}
        
      </Routes>
    </Router>
  )
}

export default App 