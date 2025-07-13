
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import HomePage from './components/pages/HomePage.tsx';
import BlackjackPage from './components/pages/BlackjackPage.tsx';
import RoulettePage from './components/pages/RoulettePage.tsx';
import KenoPage from './components/pages/KenoPage.tsx';
import PlinkoPage from './components/pages/PlinkoPage.tsx';
import SlotsPage from './components/pages/SlotsPage.tsx';
import AccountPage from './components/pages/AccountPage.tsx';
import VaultPage from './components/pages/VaultPage.tsx';
import BetsPage from './components/pages/BetsPage.tsx';
import VIPPage from './components/pages/VIPPage.tsx';
import DeveloperPage from './components/pages/DeveloperPage.tsx';
import { GAMES } from './constants.tsx';

const App: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path={GAMES[0].path} element={<BlackjackPage />} />
            <Route path={GAMES[1].path} element={<RoulettePage />} />
            <Route path={GAMES[2].path} element={<KenoPage />} />
            <Route path={GAMES[3].path} element={<PlinkoPage />} />
            <Route path={GAMES[4].path} element={<SlotsPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/vault" element={<VaultPage />} />
            <Route path="/bets" element={<BetsPage />} />
            <Route path="/vip" element={<VIPPage />} />
            <Route path="/developer" element={<DeveloperPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;