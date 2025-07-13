
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GAMES } from '../../constants.tsx';
import Card from '../ui/Card.tsx';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-extrabold text-white mb-2">Game Lobby</h1>
      <p className="text-lg text-gray-400 mb-8">Select a game to start playing.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GAMES.map((game) => (
          <Card key={game.path} className="flex flex-col group hover:border-old-gold transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" onClick={() => navigate(game.path)}>
            <div className="flex-grow">
              <div className="flex items-center mb-4">
                <span className="text-old-gold mr-4 p-2 bg-gray-700 rounded-lg group-hover:bg-old-gold group-hover:text-charcoal transition-colors">
                  {game.icon}
                </span>
                <h2 className="text-2xl font-bold text-white group-hover:text-old-gold transition-colors">{game.name}</h2>
              </div>
              <p className="text-gray-400">{game.description}</p>
            </div>
            <div className="mt-6">
              <span className="font-semibold text-old-gold">Play Now &rarr;</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomePage;