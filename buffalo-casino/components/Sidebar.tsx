
import React from 'react';
import { NavLink } from 'react-router-dom';
import { GAMES } from '../constants.tsx';
import { FaUserCircle, FaArchive, FaHistory, FaPlusCircle, FaHome, FaStar, FaCode } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-gray-700 text-old-gold'
        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
    }`;

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 p-4 flex flex-col justify-between border-r border-gray-700">
      <div>
        <div className="flex items-center mb-8 px-2">
          <img src="https://i.ibb.co/3Wf0G5G/buffalo-logo.png" alt="Buffalo Logo" className="h-10 w-10 mr-3"/>
          <h1 className="text-2xl font-bold text-white tracking-wider">
            Buffalo <span className="text-old-gold">Casino</span>
          </h1>
        </div>

        <nav className="space-y-2">
          <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lobby</p>
          <NavLink to="/" className={navLinkClass}>
            <FaHome className="mr-3 h-5 w-5" />
            Game Lobby
          </NavLink>

          <p className="px-4 pt-6 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Games</p>
          {GAMES.map((game) => (
            <NavLink to={game.path} key={game.path} className={navLinkClass}>
              <span className="mr-3">{game.icon}</span>
              {game.name}
            </NavLink>
          ))}
          
          <p className="px-4 pt-6 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</p>
          <NavLink to="/account" className={navLinkClass}>
            <FaUserCircle className="mr-3 h-5 w-5" />
            My Account
          </NavLink>
          <NavLink to="/vault" className={navLinkClass}>
            <FaArchive className="mr-3 h-5 w-5" />
            Vault
          </NavLink>
          <NavLink to="/bets" className={navLinkClass}>
            <FaHistory className="mr-3 h-5 w-5" />
            Bet History
          </NavLink>
           <NavLink to="/vip" className={navLinkClass}>
            <FaStar className="mr-3 h-5 w-5" />
            VIP Club
          </NavLink>

          <p className="px-4 pt-6 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Development</p>
          <NavLink to="/developer" className={navLinkClass}>
            <FaCode className="mr-3 h-5 w-5" />
            DB Integration
          </NavLink>
        </nav>
      </div>
      
      <div className="mt-6">
        <button className="w-full flex items-center justify-center bg-old-gold text-charcoal font-bold py-3 px-4 rounded-lg hover:bg-yellow-500 transition-colors duration-200">
          <FaPlusCircle className="mr-2" />
          Purchase Coins
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;