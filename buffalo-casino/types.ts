
import type { ReactNode } from 'react';

export enum CoinType {
  GOLD = 'Gold Coins',
  BUFFALO = 'Buffalo Coins',
}

export interface Game {
  name: string;
  path: string;
  description: string;
  icon: ReactNode;
}

export interface CasinoState {
  [CoinType.GOLD]: number;
  [CoinType.BUFFALO]: number;
  bets: Bet[];
  totalWagered: {
    [CoinType.GOLD]: number;
    [CoinType.BUFFALO]: number;
  };
}

export type CasinoAction =
  | { type: 'SET_BALANCE'; payload: { coinType: CoinType; amount: number } }
  | { type: 'PLACE_BET'; payload: { coinType: CoinType; amount: number } }
  | { type: 'WIN_BET'; payload: { coinType: CoinType; amount: number } }
  | { type: 'ADD_BET_HISTORY'; payload: Bet };

export interface Bet {
  game: string;
  amount: number;
  coinType: CoinType;
  outcome: 'win' | 'loss' | 'push';
  payout: number;
  date: string;
}

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}
