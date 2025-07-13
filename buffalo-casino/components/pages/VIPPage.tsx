
import React, { ReactNode } from 'react';
import Card from '../ui/Card.tsx';
import { useCasino } from '../../context/CasinoContext.tsx';
import { FaStar, FaTrophy, FaGem, FaShieldAlt, FaCrown } from 'react-icons/fa';
import { CoinType } from '../../types.ts';

interface Tier {
  name: string;
  wagerRequirement: number;
  icon: ReactNode;
  color: string;
  benefits: string[];
}

const VIP_TIERS: Tier[] = [
  { name: 'Bronze', wagerRequirement: 0, icon: <FaShieldAlt />, color: 'text-yellow-700', benefits: ['Standard Payouts'] },
  { name: 'Silver', wagerRequirement: 10000, icon: <FaStar />, color: 'text-gray-400', benefits: ['5% Weekly Rakeback'] },
  { name: 'Gold', wagerRequirement: 50000, icon: <FaTrophy />, color: 'text-yellow-500', benefits: ['10% Weekly Rakeback', 'Dedicated Support'] },
  { name: 'Platinum', wagerRequirement: 250000, icon: <FaGem />, color: 'text-teal-400', benefits: ['15% Weekly Rakeback', 'Exclusive Bonuses'] },
  { name: 'Diamond', wagerRequirement: 1000000, icon: <FaCrown />, color: 'text-blue-400', benefits: ['20% Weekly Rakeback', 'Personal VIP Host', 'Special Event Invites'] },
];

const VIPPage: React.FC = () => {
    const { state } = useCasino();
    const totalWagered = state.totalWagered[CoinType.GOLD];

    const currentTierIndex = VIP_TIERS.slice().reverse().findIndex(tier => totalWagered >= tier.wagerRequirement);
    const currentTier = VIP_TIERS[VIP_TIERS.length - 1 - currentTierIndex];
    const nextTier = VIP_TIERS[VIP_TIERS.length - currentTierIndex];

    const progressPercentage = nextTier
        ? ((totalWagered - currentTier.wagerRequirement) / (nextTier.wagerRequirement - currentTier.wagerRequirement)) * 100
        : 100;

    return (
        <div className="animate-fade-in">
            <h1 className="text-4xl font-extrabold text-white mb-2">VIP Club</h1>
            <p className="text-lg text-gray-400 mb-8">Your loyalty is rewarded. Wager more to unlock exclusive benefits.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <Card className="bg-gray-800/50">
                    <h2 className="text-xl font-bold text-old-gold mb-2">Total Gold Coins Wagered</h2>
                    <p className="text-4xl font-extrabold text-white">{state.totalWagered[CoinType.GOLD].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </Card>
                <Card className="bg-gray-800/50">
                    <h2 className="text-xl font-bold text-old-gold mb-2">Total Buffalo Coins Wagered</h2>
                    <p className="text-4xl font-extrabold text-white">{state.totalWagered[CoinType.BUFFALO].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </Card>
            </div>
            
            <Card>
                <div className="flex items-center mb-6">
                    <div className={`mr-4 text-5xl ${currentTier.color}`}>{currentTier.icon}</div>
                    <div>
                        <h2 className="text-3xl font-bold text-white">Current Tier: <span className={currentTier.color}>{currentTier.name}</span></h2>
                        <p className="text-gray-400">Your current benefits include: {currentTier.benefits.join(', ')}.</p>
                    </div>
                </div>

                {nextTier && (
                    <div>
                        <div className="flex justify-between items-center mb-2 text-sm">
                            <span className="font-bold text-gray-300">Progress to {nextTier.name}</span>
                            <span className="font-mono text-old-gold">{progressPercentage.toFixed(2)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-4">
                            <div className="bg-old-gold h-4 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                        <p className="text-center text-gray-400 mt-2 text-sm">
                            Wager <span className="font-bold text-white">{(nextTier.wagerRequirement - totalWagered).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> more Gold Coins to reach the next tier.
                        </p>
                    </div>
                )}
                
                {currentTier.name === 'Diamond' && (
                     <p className="text-center text-lg font-bold text-blue-400 mt-4">You've reached the highest VIP tier! Congratulations!</p>
                )}
            </Card>

            <div className="mt-8">
                 <h3 className="text-2xl font-bold text-white mb-4">All VIP Tiers & Benefits</h3>
                 <div className="space-y-4">
                    {VIP_TIERS.map(tier => (
                         <Card key={tier.name} className={`border-l-4 ${currentTier.name === tier.name ? 'border-old-gold bg-gray-800/70' : 'border-gray-700 bg-gray-800/30'}`}>
                             <div className="flex items-center">
                                 <div className={`mr-4 text-3xl ${tier.color}`}>{tier.icon}</div>
                                 <div>
                                     <h4 className="text-xl font-bold text-white">{tier.name}</h4>
                                     <p className="text-sm text-gray-400">Requires {tier.wagerRequirement.toLocaleString()} Wagered</p>
                                     <p className="text-sm text-gray-300 mt-1">Benefits: {tier.benefits.join(', ')}</p>
                                 </div>
                             </div>
                         </Card>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default VIPPage;