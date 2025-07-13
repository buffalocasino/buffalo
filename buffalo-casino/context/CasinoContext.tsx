
import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { CasinoState, CasinoAction, CoinType, Bet } from '../types.ts';

const initialState: CasinoState = {
  [CoinType.GOLD]: 10000,
  [CoinType.BUFFALO]: 100,
  bets: [],
  totalWagered: {
    [CoinType.GOLD]: 0,
    [CoinType.BUFFALO]: 0,
  },
};

const CasinoReducer = (state: CasinoState, action: CasinoAction): CasinoState => {
  switch (action.type) {
    case 'SET_BALANCE':
      return {
        ...state,
        [action.payload.coinType]: action.payload.amount,
      };
    case 'PLACE_BET':
      if (state[action.payload.coinType] < action.payload.amount) return state;
      return {
        ...state,
        [action.payload.coinType]: state[action.payload.coinType] - action.payload.amount,
        totalWagered: {
          ...state.totalWagered,
          [action.payload.coinType]: state.totalWagered[action.payload.coinType] + action.payload.amount,
        },
      };
    case 'WIN_BET':
      return {
        ...state,
        [action.payload.coinType]: state[action.payload.coinType] + action.payload.amount,
      };
    case 'ADD_BET_HISTORY':
      return {
        ...state,
        bets: [action.payload, ...state.bets].slice(0, 100), // Keep last 100 bets
      };
    default:
      return state;
  }
};

interface CasinoContextProps {
  state: CasinoState;
  dispatch: React.Dispatch<CasinoAction>;
}

const CasinoContext = createContext<CasinoContextProps | undefined>(undefined);

export const CasinoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(CasinoReducer, initialState);

  return (
    <CasinoContext.Provider value={{ state, dispatch }}>
      {children}
    </CasinoContext.Provider>
  );
};

export const useCasino = (): CasinoContextProps => {
  const context = useContext(CasinoContext);
  if (!context) {
    throw new Error('useCasino must be used within a CasinoProvider');
  }
  return context;
};