
import React from 'react';
import type { Game } from './types.ts';

// SVG Icons as React Components for better reusability and styling
const BlackjackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 15.536A9.004 9.004 0 0112 15c-1.485 0-2.87.51-3.964 1.358M12 21h.01M3 12a9 9 0 0118 0h-2.115a6.885 6.885 0 00-13.77 0H3zm16.885 0a6.885 6.885 0 00-5.462-6.586 9.004 9.004 0 00-1.898-3.31A9.008 9.008 0 0112 3c-1.485 0-2.87.51-3.964 1.358L6.4 7.5" />
  </svg>
);

const RouletteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 16a6 6 0 110-12 6 6 0 010 12z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
  </svg>
);

const KenoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4v16M12 4v16M18 4v16" />
    </svg>
);


const PlinkoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
  </svg>
);

const SlotsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 16v-2m4-12l1.414-1.414M6.586 6.586L8 8m8 8l1.414 1.414M8 16l-1.414 1.414M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const BuffaloSkullIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.388 8.242c-2.324-1.752-2.92-4.48-.923-6.474.764-.764 1.73-.93 2.535-.558C9.537 2.05 10.87 3 12 3s2.463-.95 4.001-1.79c.804-.372 1.77-.206 2.534.558 1.997 1.995 1.4 4.723-.923 6.475C16.14 9.49 14.135 11 12 11s-4.14-1.51-5.612-2.758zM9.5 11a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM12 13c-2.473 0-4.5 2.027-4.5 4.5S9.527 22 12 22s4.5-2.027 4.5-4.5S14.473 13 12 13zm0 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" />
    </svg>
);

export const GAMES: Game[] = [
  {
    name: 'Blackjack',
    path: '/blackjack',
    description: 'Classic card game. Get as close to 21 as possible without going over.',
    icon: <BlackjackIcon />,
  },
  {
    name: 'Roulette',
    path: '/roulette',
    description: 'Bet on where the ball will land. Red or black, odd or even, or the exact number.',
    icon: <RouletteIcon />,
  },
  {
    name: 'Buffalo Keno',
    path: '/keno',
    description: 'Pick your lucky numbers and watch the draw. Match more numbers to win big!',
    icon: <KenoIcon />,
  },
  {
    name: 'Plinko',
    path: '/plinko',
    description: 'Drop a chip and watch it bounce its way to a prize multiplier at the bottom.',
    icon: <PlinkoIcon />,
  },
  {
    name: 'Buffalo Slots',
    path: '/slots',
    description: 'Spin the reels and match the symbols for a chance to win the jackpot.',
    icon: <SlotsIcon />,
  },
];
