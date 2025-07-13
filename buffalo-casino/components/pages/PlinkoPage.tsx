
import React from 'react';
import Card from '../ui/Card.tsx';
import Button from '../ui/Button.tsx';

const PlinkoPage: React.FC = () => {
    const multipliers = [0.5, 1, 1.5, 0.5, 2, 0.5, 1.5, 1, 0.5];
    return (
        <Card>
            <h1 className="text-3xl font-bold text-old-gold mb-4">Plinko</h1>
            <p className="text-gray-400 mb-6">Game coming soon!</p>
            <div className="bg-gray-900/50 border border-old-gold/30 rounded-lg p-4 flex flex-col items-center min-h-[400px]">
                <div className="w-full aspect-square relative max-w-sm">
                    {[...Array(8)].map((_, row) => (
                         <div key={row} className="flex justify-center" style={{ marginBottom: '-8px' }}>
                             {[...Array(row + 2)].map((_, col) => (
                                <div key={col} className="w-3 h-3 bg-gray-500 rounded-full m-2"></div>
                            ))}
                         </div>
                    ))}
                </div>
                <div className="flex w-full max-w-lg mt-4">
                    {multipliers.map((m, i) => (
                        <div key={i} className="flex-1 text-center bg-gray-700 mx-1 py-2 rounded-t-md text-white font-bold border-b-4 border-old-gold">
                            {m}x
                        </div>
                    ))}
                </div>
                <div className="mt-8">
                    <Button disabled>Drop Chip</Button>
                </div>
            </div>
        </Card>
    );
};

export default PlinkoPage;