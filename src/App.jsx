import React from 'react';
import { AppProvider } from './context/AppContext';
import StarryBackground from './components/StarryBackground';
import Header from './components/Header';
import SkyRadar from './components/SkyRadar';
import FeaturedEvent from './components/FeaturedEvent';
import UpcomingRadar from './components/UpcomingRadar';
import SettingsModal from './components/SettingsModal';
import Footer from './components/Footer';

function MainApp() {
  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col justify-between selection:bg-purple-500 selection:text-white">
      {/* Dynamic Animated Cosmic Atmosphere */}
      <StarryBackground />

      {/* Main Mobile-First Shell (Optimal for Phones and Tablets) */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex-1 flex flex-col">
        {/* Navigation & Personalized Explorer Header */}
        <Header />

        {/* Core Mobile Content Flow */}
        <main className="flex-1 space-y-3 pb-4">
          {/* Celestial & Solar Tracker */}
          <SkyRadar />

          {/* Today's Featured Wonder / Festival */}
          <FeaturedEvent />

          {/* Upcoming Radar & 30-Day Countdown Timeline */}
          <UpcomingRadar />
        </main>

        {/* Warm Personalized Footer */}
        <Footer />
      </div>

      {/* Control Center & Customization Modal */}
      <SettingsModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
