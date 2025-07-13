
import React from 'react';
import Card from '../ui/Card.tsx';
import Button from '../ui/Button.tsx';

const RoulettePage: React.FC = () => {
    return (
        <Card>
            <h1 className="text-3xl font-bold text-old-gold mb-4">Roulette</h1>
            <p className="text-gray-400 mb-6">Game coming soon!</p>
            <div className="bg-green-800/50 border border-green-600 rounded-lg p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-64 h-64 rounded-full bg-gray-900 border-8 border-yellow-600 flex items-center justify-center mb-6 animate-spin-slow">
                    <div className="w-48 h-48 rounded-full bg-green-700 relative">
                        <div className="absolute w-full h-full">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="absolute w-full h-full" style={{ transform: `rotate(${i * 30}deg)` }}>
                                    <div className={`absolute top-0 left-1/2 -ml-1 w-2 h-4 ${i % 2 === 0 ? 'bg-red-500' : 'bg-black'}`}></div>
                                </div>
                            ))}
                        </div>
                        <div className="w-16 h-16 rounded-full bg-gray-800 absolute top-1/2 left-1/2 -mt-8 -ml-8 flex items-center justify-center text-old-gold">
                            <div className="w-4 h-4 rounded-full bg-white animate-pulse"></div>
                        </div>
                    </div>
                </div>
                <p className="text-2xl font-bold text-white mb-4">Place your bets!</p>
                <Button disabled>Spin Wheel</Button>
            </div>
        </Card>
    );
};

export default RoulettePage;