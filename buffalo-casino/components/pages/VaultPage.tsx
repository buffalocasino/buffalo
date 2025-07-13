
import React from 'react';
import Card from '../ui/Card.tsx';
import Button from '../ui/Button.tsx';
import { useCasino } from '../../context/CasinoContext.tsx';
import { CoinType } from '../../types.ts';

const VaultPage: React.FC = () => {
    const { state } = useCasino();
  return (
    <Card>
      <h1 className="text-2xl font-bold text-old-gold mb-6">Coin Vault</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50">
            <h2 className="text-xl font-bold text-yellow-400 mb-2">{CoinType.GOLD}</h2>
            <p className="text-4xl font-extrabold text-white mb-4">{state[CoinType.GOLD].toLocaleString()}</p>
            <Button>Purchase More</Button>
        </Card>
        <Card className="bg-gray-900/50">
            <h2 className="text-xl font-bold text-blue-400 mb-2">{CoinType.BUFFALO}</h2>
            <p className="text-4xl font-extrabold text-white mb-4">{state[CoinType.BUFFALO].toLocaleString()}</p>
            <Button>Redeem Winnings</Button>
        </Card>
      </div>
      <p className="text-gray-400 mt-6">Here you can purchase Gold Coins for play, and redeem your sweepstakes Buffalo Coins for prizes.</p>
    </Card>
  );
};

export default VaultPage;