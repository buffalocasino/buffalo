
import React from 'react';
import { useCasino } from '../context/CasinoContext.tsx';
import { CoinType } from '../types.ts';
import { FaCoins } from 'react-icons/fa';

const Header: React.FC = () => {
  const { state } = useCasino();

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-lg p-4 flex justify-end items-center space-x-6">
       <div className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-full">
         <FaCoins className="text-yellow-400 h-5 w-5" />
         <span className="font-semibold text-white">{state[CoinType.GOLD].toLocaleString()}</span>
         <span className="text-xs text-gray-400">{CoinType.GOLD}</span>
       </div>
       <div className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-full">
         <img src="https://i.ibb.co/3Wf0G5G/buffalo-logo.png" alt="Buffalo Coin" className="h-5 w-5"/>
         <span className="font-semibold text-white">{state[CoinType.BUFFALO].toLocaleString()}</span>
         <span className="text-xs text-gray-400">{CoinType.BUFFALO}</span>
       </div>
    </header>
  );
};

export default Header;