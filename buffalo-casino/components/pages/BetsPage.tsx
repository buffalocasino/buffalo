
import React from 'react';
import Card from '../ui/Card.tsx';
import { useCasino } from '../../context/CasinoContext.tsx';
import { Bet } from '../../types.ts';

const BetRow: React.FC<{ bet: Bet }> = ({ bet }) => {
    const outcomeColor = bet.outcome === 'win' ? 'text-green-400' : bet.outcome === 'loss' ? 'text-red-400' : 'text-gray-400';
    return (
        <div className="grid grid-cols-5 gap-4 p-3 border-b border-gray-700 items-center">
            <div className="font-semibold">{bet.game}</div>
            <div className="text-gray-300">{new Date(bet.date).toLocaleString()}</div>
            <div className="font-mono text-right">{bet.amount.toLocaleString()} {bet.coinType.split(' ')[0]}</div>
            <div className={`font-bold text-right ${outcomeColor}`}>{bet.outcome.toUpperCase()}</div>
            <div className="font-mono text-right text-green-400">{bet.payout > 0 ? `+${bet.payout.toLocaleString()}`: '-'}</div>
        </div>
    );
}

const BetsPage: React.FC = () => {
  const { state } = useCasino();
  return (
    <Card>
      <h1 className="text-2xl font-bold text-old-gold mb-4">Bet History</h1>
      <div className="bg-gray-900/50 rounded-lg">
        <div className="grid grid-cols-5 gap-4 p-3 border-b-2 border-gray-600 text-sm font-bold text-gray-400 uppercase">
          <div>Game</div>
          <div>Date</div>
          <div className="text-right">Bet</div>
          <div className="text-right">Outcome</div>
          <div className="text-right">Payout</div>
        </div>
        <div className="max-h-96 overflow-y-auto">
            {state.bets.length > 0 ? (
                state.bets.map((bet, index) => <BetRow key={index} bet={bet} />)
            ) : (
                <p className="text-gray-400 text-center p-8">No bets recorded yet.</p>
            )}
        </div>
      </div>
    </Card>
  );
};

export default BetsPage;