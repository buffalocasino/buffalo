
import React from 'react';
import Card from '../ui/Card.tsx';
import Button from '../ui/Button.tsx';

const Reel: React.FC<{ symbols: string[] }> = ({ symbols }) => (
    <div className="h-32 w-24 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-5xl animate-pulse">{symbols[Math.floor(Math.random() * symbols.length)]}</div>
    </div>
);

const SlotsPage: React.FC = () => {
    const symbols = ['🦬', '💎', '🔔', '🍒', '7️⃣'];

    return (
        <Card className="max-w-xl mx-auto">
            <h1 className="text-3xl font-bold text-old-gold mb-4 text-center">Buffalo Slots</h1>
            <p className="text-gray-400 mb-6 text-center">Match the symbols to win!</p>
            <Card className="bg-charcoal border-old-gold p-6">
                <div className="flex justify-center space-x-4 mb-6">
                    <Reel symbols={symbols} />
                    <Reel symbols={symbols} />
                    <Reel symbols={symbols} />
                </div>
                <div className="flex justify-center">
                    <Button className="w-1/2 py-3 text-xl" disabled>Spin</Button>
                </div>
            </Card>
        </Card>
    );
};

export default SlotsPage;