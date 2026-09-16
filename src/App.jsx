import React from 'react';
import { AppProvider } from './context/AppContext';
import StarryBackground from './components/StarryBackground';
import Header from './components/Header';
import WeatherForecast from './components/WeatherForecast';
import SkyRadar from './components/SkyRadar';
import CosmicDailyWonder from './components/CosmicDailyWonder';
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
        <main className="flex-1 space-y-2.5 pb-4">
          {/* 5-Day Live Weather Forecast (Temperature, Rain/Snow, Wind) - Now above Mehin's Sky */}
          <WeatherForecast />

          {/* Celestial & Solar Tracker (Sun Journey & Moon Radar - "Mehin's Sky") */}
          <SkyRadar />

          {/* Daily Mind-Blowing Cosmic Wonder for Mehin */}
          <CosmicDailyWonder />

          {/* Today's Featured Wonder / Festival */}
          <FeaturedEvent />

          {/* Upcoming Radar (Next 40 Days with Meteor Showers & Holidays) */}
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
