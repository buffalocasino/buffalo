
import React, { useState, useEffect, useCallback } from 'react';
import type { Card as CardType, Suit, Rank } from '../../types.ts';
import Button from '../ui/Button.tsx';
import Card from '../ui/Card.tsx';
import { useCasino } from '../../context/CasinoContext.tsx';
import { CoinType } from '../../types.ts';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const createDeck = (): CardType[] => {
  const deck = SUITS.flatMap(suit =>
    RANKS.map(rank => {
      let value: number;
      if (rank === 'A') value = 11;
      else if (['K', 'Q', 'J'].includes(rank)) value = 10;
      else value = parseInt(rank);
      return { suit, rank, value };
    })
  );
  return deck;
};

const shuffleDeck = (deck: CardType[]): CardType[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Hand: React.FC<{ cards: CardType[], score: number, title: string, isDealer?: boolean, isPlayerTurn?: boolean }> = ({ cards, score, title, isDealer = false, isPlayerTurn = false }) => (
  <div>
    <h2 className="text-xl font-bold text-old-gold mb-2">{title} - Score: {score > 0 ? score : ''}</h2>
    <div className="flex space-x-2 h-36">
      {cards.map((card, index) => (
        <div key={index} className={`w-24 h-36 rounded-lg shadow-lg flex items-center justify-center text-3xl font-bold relative transition-transform duration-500 ${isDealer && index === 0 && isPlayerTurn ? 'bg-red-800' : 'bg-white'}`}>
          {isDealer && index === 0 && isPlayerTurn ?
            <div className="text-red-200 text-5xl font-extrabold">?</div>
            :
            <>
              <span className={`${(card.suit === 'hearts' || card.suit === 'diamonds') ? 'text-red-600' : 'text-black'}`}>
                {card.rank}
              </span>
              <span className={`absolute top-1 left-2 text-xl ${(card.suit === 'hearts' || card.suit === 'diamonds') ? 'text-red-600' : 'text-black'}`}>
                { {hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠'}[card.suit] }
              </span>
            </>
          }
        </div>
      ))}
    </div>
  </div>
);


const BlackjackPage: React.FC = () => {
    const [deck, setDeck] = useState<CardType[]>([]);
    const [playerHand, setPlayerHand] = useState<CardType[]>([]);
    const [dealerHand, setDealerHand] = useState<CardType[]>([]);
    const [playerScore, setPlayerScore] = useState(0);
    const [dealerScore, setDealerScore] = useState(0);
    const [gameState, setGameState] = useState<'betting' | 'player-turn' | 'dealer-turn' | 'end'>('betting');
    const [message, setMessage] = useState('Place your bet to start.');
    const [bet, setBet] = useState(10);
    const { dispatch } = useCasino();

    const calculateScore = (hand: CardType[]): number => {
        let score = hand.reduce((sum, card) => sum + card.value, 0);
        let aces = hand.filter(card => card.rank === 'A').length;
        while (score > 21 && aces > 0) {
            score -= 10;
            aces--;
        }
        return score;
    };
    
    const startNewGame = useCallback(() => {
        const newDeck = shuffleDeck(createDeck());
        const playerInitial = [newDeck.pop()!, newDeck.pop()!];
        const dealerInitial = [newDeck.pop()!, newDeck.pop()!];
        
        setDeck(newDeck);
        setPlayerHand(playerInitial);
        setDealerHand(dealerInitial);
        setGameState('player-turn');
        setMessage('Your turn. Hit or Stand?');
    }, []);
    
    useEffect(() => {
      const isPlayerTurn = gameState === 'player-turn';
      setPlayerScore(calculateScore(playerHand));
      if (isPlayerTurn) {
         setDealerScore(calculateScore(dealerHand.slice(1)));
      } else {
         setDealerScore(calculateScore(dealerHand));
      }
    }, [playerHand, dealerHand, gameState]);

    const handleBet = () => {
        dispatch({ type: 'PLACE_BET', payload: { coinType: CoinType.GOLD, amount: bet } });
        startNewGame();
    };

    const handleHit = () => {
        if (gameState !== 'player-turn' || !deck.length) return;
        const newHand = [...playerHand, deck.pop()!];
        setPlayerHand(newHand);
        setDeck([...deck]);

        if (calculateScore(newHand) > 21) {
            setGameState('end');
            setMessage('Bust! You lose.');
            dispatch({ type: 'ADD_BET_HISTORY', payload: { game: 'Blackjack', amount: bet, coinType: CoinType.GOLD, outcome: 'loss', payout: 0, date: new Date().toISOString() } });
        }
    };
    
    const handleStand = () => {
        if (gameState !== 'player-turn') return;
        setGameState('dealer-turn');
    };
    
    useEffect(() => {
        if (gameState === 'dealer-turn') {
            let currentDealerHand = [...dealerHand];
            let currentDeck = [...deck];
            while (calculateScore(currentDealerHand) < 17 && currentDeck.length > 0) {
                currentDealerHand.push(currentDeck.pop()!);
            }
            setDealerHand(currentDealerHand);
            setDeck(currentDeck);
            setGameState('end');
        }
    }, [gameState, dealerHand, deck]);

    useEffect(() => {
        if (gameState === 'end' && playerHand.length > 0) {
            const finalPlayerScore = calculateScore(playerHand);
            const finalDealerScore = calculateScore(dealerHand);

            if (finalPlayerScore > 21) {
                setMessage('Bust! You lose.');
                dispatch({ type: 'ADD_BET_HISTORY', payload: { game: 'Blackjack', amount: bet, coinType: CoinType.GOLD, outcome: 'loss', payout: 0, date: new Date().toISOString() } });
            } else if (finalDealerScore > 21 || finalPlayerScore > finalDealerScore) {
                setMessage('You win!');
                dispatch({ type: 'WIN_BET', payload: { coinType: CoinType.GOLD, amount: bet * 2 } });
                dispatch({ type: 'ADD_BET_HISTORY', payload: { game: 'Blackjack', amount: bet, coinType: CoinType.GOLD, outcome: 'win', payout: bet * 2, date: new Date().toISOString() } });
            } else if (finalPlayerScore < finalDealerScore) {
                setMessage('Dealer wins.');
                dispatch({ type: 'ADD_BET_HISTORY', payload: { game: 'Blackjack', amount: bet, coinType: CoinType.GOLD, outcome: 'loss', payout: 0, date: new Date().toISOString() } });
            } else {
                setMessage('Push. It\'s a tie.');
                dispatch({ type: 'WIN_BET', payload: { coinType: CoinType.GOLD, amount: bet } });
                dispatch({ type: 'ADD_BET_HISTORY', payload: { game: 'Blackjack', amount: bet, coinType: CoinType.GOLD, outcome: 'push', payout: bet, date: new Date().toISOString() } });
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState, dealerHand]);

    return (
        <Card className="max-w-4xl mx-auto flex flex-col items-center space-y-6 bg-green-800/50 border-green-700">
            <h1 className="text-4xl font-extrabold text-white">Blackjack</h1>
            
            <div className="w-full space-y-8">
                <Hand cards={dealerHand} score={dealerScore} title="Dealer's Hand" isDealer={true} isPlayerTurn={gameState === 'player-turn'}/>
                <Hand cards={playerHand} score={playerScore} title="Your Hand" />
            </div>

            <Card className="w-full bg-gray-900/50">
                <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-white">{message}</div>
                    {gameState === 'betting' || gameState === 'end' ? (
                        <div className="flex items-center space-x-4">
                           <input type="number" value={bet} onChange={e => setBet(Math.max(1, parseInt(e.target.value) || 1))} className="bg-gray-700 text-white rounded p-2 w-24 text-center"/>
                           <Button onClick={handleBet} disabled={bet <= 0}>
                                {gameState === 'betting' ? 'Place Bet' : 'Play Again'}
                           </Button>
                        </div>
                    ) : (
                        <div className="flex space-x-4">
                            <Button onClick={handleHit} disabled={playerScore >= 21}>Hit</Button>
                            <Button onClick={handleStand} variant="secondary">Stand</Button>
                        </div>
                    )}
                </div>
            </Card>
        </Card>
    );
};

export default BlackjackPage;