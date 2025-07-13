
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Card from '../ui/Card.tsx';
import Button from '../ui/Button.tsx';
import { useCasino } from '../../context/CasinoContext.tsx';
import { CoinType } from '../../types.ts';
import { FaCoins } from 'react-icons/fa';
import { BuffaloSkullIcon } from '../../constants.tsx';

// Payout table adjusted to target a lower RTP.
const PAYOUT_TABLE: { [key: number]: { [key: number]: number } } = {
    10: { 0: 0, 1: 0, 2: 0, 3: 0.5, 4: 1, 5: 3, 6: 8, 7: 20, 8: 100, 9: 500, 10: 1000 },
    9: { 0:0, 1:0, 2:0, 3:0, 4: 1, 5: 4, 6: 20, 7: 150, 8: 1000, 9: 5000 },
    8: { 0:0, 1:0, 2:0, 3:0, 4: 2, 5: 10, 6: 50, 7: 250, 8: 2000 },
    7: { 0:0, 1:0, 2:0, 3: 1, 4: 5, 5: 15, 6: 100, 7: 1000 },
    6: { 0:0, 1:0, 2:0, 3: 1, 4: 2, 5: 20, 6: 250 },
    5: { 0:0, 1:0, 2:0, 3: 1, 4: 5, 5: 50 },
    4: { 0:0, 1:0, 2: 1, 3: 4, 4: 20 },
    3: { 0:0, 1:0, 2: 2, 3: 25 },
    2: { 0:0, 1:0, 2: 10 },
    1: { 0:0, 1: 3 },
};

const GOLD_COIN_BETS = [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1.00, 1.50, 2, 5, 10, 20, 50, 100, 250, 500, 1000, 2000];
const BUFFALO_COIN_BETS = [0.10, 0.20, 0.50, 1, 2, 5, 10, 20, 50, 100];

const BONUS_PAYOUTS: { [key: number]: number } = { 3: 8, 4: 12 };
const NORMAL_BONUS_SPOTS = 4;
const MAX_FREE_PLAYS = 50;

const Payouts: React.FC<{ picks: number }> = ({ picks }) => {
    const tableData = PAYOUT_TABLE[picks];

    if (!tableData || picks === 0) {
        return (
            <Card className="bg-gray-900/50 sticky top-6">
                <h3 className="text-xl font-bold text-old-gold mb-2">Payout Odds</h3>
                <p className="text-gray-400">Select 1-10 numbers to see odds.</p>
            </Card>
        );
    }
    
    const sortedHits = Object.keys(tableData).map(Number).sort((a,b) => b-a);

    return (
        <Card className="bg-gray-900/50 sticky top-6">
            <h3 className="text-xl font-bold text-old-gold mb-4">Payouts for {picks} Picks</h3>
            <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-600">
                            <th className="py-2 text-gray-300">Hits</th>
                            <th className="py-2 text-gray-300 text-right">Multiplier</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedHits.map(hits => (
                            tableData[hits] > 0 &&
                            <tr key={hits} className="border-b border-gray-700/50">
                                <td className="py-2">{hits}</td>
                                <td className="py-2 text-right font-mono text-old-gold">{tableData[hits].toLocaleString('en-US')}x</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};


const KenoPage: React.FC = () => {
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
    const [matchedNumbers, setMatchedNumbers] = useState<number[]>([]);
    const [gameState, setGameState] = useState<'betting' | 'drawing' | 'result'>('betting');
    const [betAmount, setBetAmount] = useState<number>(1);
    const [coinType, setCoinType] = useState<CoinType>(CoinType.GOLD);
    
    const [freePlays, setFreePlays] = useState(0);
    const [coinSpots, setCoinSpots] = useState<number[]>([]);
    const [bonusConfig, setBonusConfig] = useState<{amount: number, coinType: CoinType} | null>(null);
    const [showBonusPopup, setShowBonusPopup] = useState(false);
    const [bonusWinInfo, setBonusWinInfo] = useState({ hits: 0, plays: 0 });
    const [lastWinAmount, setLastWinAmount] = useState<number>(0);
    const [rtpHistory, setRtpHistory] = useState<{ bet: number; win: number }[]>([]);

    const { state: casinoState, dispatch } = useCasino();

    const betSteps = useMemo(() => {
        return coinType === CoinType.GOLD ? GOLD_COIN_BETS : BUFFALO_COIN_BETS;
    }, [coinType]);

    useEffect(() => {
        setBetAmount(currentBetAmount => {
            const newBetSteps = coinType === CoinType.GOLD ? GOLD_COIN_BETS : BUFFALO_COIN_BETS;
            if (newBetSteps.includes(currentBetAmount)) {
                return currentBetAmount;
            }
            
            const maxForNewCoin = newBetSteps[newBetSteps.length - 1];
            if (currentBetAmount > maxForNewCoin) {
                return maxForNewCoin;
            }
    
            const closestLowerStep = [...newBetSteps].reverse().find(s => s < currentBetAmount);
            return closestLowerStep || newBetSteps[0];
        });
    }, [coinType]);
    
    const isFreePlay = freePlays > 0;
    const isInteractionDisabled = gameState === 'drawing';

    const toggleNumber = (num: number) => {
        if (gameState === 'drawing') return;
        if (selectedNumbers.includes(num)) {
            setSelectedNumbers(selectedNumbers.filter(n => n !== num));
        } else if (selectedNumbers.length < 10) {
            setSelectedNumbers([...selectedNumbers, num]);
        }
    };

    const handleQuickPick = () => {
        if (gameState === 'drawing') return;
        const picks: number[] = [];
        while (picks.length < 10) {
            const randomNum = Math.floor(Math.random() * 80) + 1;
            if (!picks.includes(randomNum)) {
                picks.push(randomNum);
            }
        }
        setSelectedNumbers(picks);
    };

    const handleClear = () => {
        if (gameState === 'drawing') return;
        setSelectedNumbers([]);
    };

    const handleStartDraw = useCallback(async () => {
        const isStartingFreePlay = freePlays > 0;
        const canPlayPaid = selectedNumbers.length > 0 && betAmount > 0 && casinoState[coinType] >= betAmount;

        if (gameState === 'drawing' || (!isStartingFreePlay && !canPlayPaid)) {
            return;
        }

        setDrawnNumbers([]);
        setMatchedNumbers([]);
        setLastWinAmount(0);
        setGameState('drawing');
        
        await new Promise(res => setTimeout(res, 250)); 

        let finalCoinSpots: number[] = [];
        
        if (isStartingFreePlay) {
            setFreePlays(prev => prev - 1);
            finalCoinSpots = [...coinSpots]; 
        } else {
            dispatch({ type: 'PLACE_BET', payload: { coinType, amount: betAmount } });
            setBonusConfig({ amount: betAmount, coinType: coinType });
            
            const spotCount = NORMAL_BONUS_SPOTS;
            const spots = new Set<number>();
            while (spots.size < spotCount) {
                spots.add(Math.floor(Math.random() * 80) + 1);
            }
            finalCoinSpots = Array.from(spots);
            setCoinSpots(finalCoinSpots);
        }

        const draw = new Set<number>();
        while (draw.size < 20) {
            draw.add(Math.floor(Math.random() * 80) + 1);
        }
        const finalDrawnNumbers = Array.from(draw);
        
        for (let i = 0; i < finalDrawnNumbers.length; i++) {
            setDrawnNumbers(prev => [...prev, finalDrawnNumbers[i]]);
            await new Promise(res => setTimeout(res, 100));
        }

        const matches = selectedNumbers.filter(n => finalDrawnNumbers.includes(n));
        setMatchedNumbers(matches);
        
        const currentBetInfo = isStartingFreePlay ? bonusConfig! : { amount: betAmount, coinType };
        
        const picksCount = selectedNumbers.length;
        const matchCount = matches.length;
        const payoutMultiplier = PAYOUT_TABLE[picksCount]?.[matchCount] || 0;
        const winnings = currentBetInfo.amount * payoutMultiplier;
        setLastWinAmount(winnings);

        if (winnings > 0) {
            dispatch({ type: 'WIN_BET', payload: { coinType: currentBetInfo.coinType, amount: winnings } });
        }

        const bonusHitsCount = finalDrawnNumbers.filter(n => finalCoinSpots.includes(n)).length;
        const freePlaysWon = BONUS_PAYOUTS[bonusHitsCount] || 0;

        if (freePlaysWon > 0) {
            setFreePlays(prev => Math.min(MAX_FREE_PLAYS, prev + freePlaysWon));
            setBonusWinInfo({ hits: bonusHitsCount, plays: freePlaysWon });
            setTimeout(() => setShowBonusPopup(true), 500);
        }

        if (!isStartingFreePlay) {
            setRtpHistory(prev => {
                const newHistory = [...prev, { bet: betAmount, win: winnings }];
                if (newHistory.length > 1000) {
                    newHistory.shift();
                }
                return newHistory;
            });

            dispatch({
                type: 'ADD_BET_HISTORY',
                payload: {
                    game: 'Buffalo Keno',
                    amount: betAmount,
                    coinType,
                    outcome: (winnings > betAmount || freePlaysWon > 0) ? 'win' : 'loss',
                    payout: winnings,
                    date: new Date().toISOString()
                }
            });
        }
        
        const updatedFreePlays = freePlays - (isStartingFreePlay ? 1 : 0) + freePlaysWon;
        if (updatedFreePlays <= 0) {
            setBonusConfig(null);
            setCoinSpots([]); 
        }

        setGameState('result');

    }, [freePlays, selectedNumbers, betAmount, casinoState, coinType, gameState, dispatch, coinSpots, bonusConfig]);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !e.repeat) {
                const betInput = document.querySelector('input[type="number"]');
                if (document.activeElement === betInput || showBonusPopup) {
                    return;
                }
                e.preventDefault();
                handleStartDraw();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleStartDraw, showBonusPopup]);

    const rtp = useMemo(() => {
        if (rtpHistory.length < 10) return null; // Only show after a few rounds
        const totalBets = rtpHistory.reduce((sum, item) => sum + item.bet, 0);
        const totalWins = rtpHistory.reduce((sum, item) => sum + item.win, 0);
        if (totalBets === 0) return null;
        return (totalWins / totalBets) * 100;
    }, [rtpHistory]);

    const getNumberClass = (num: number) => {
        const isSelected = selectedNumbers.includes(num);
        const isDrawn = drawnNumbers.includes(num);
        const isMatched = isSelected && isDrawn;

        if (isMatched) return 'bg-yellow-400 text-charcoal scale-110 ring-2 ring-white animate-fade-in';
        if (isSelected) return `bg-dark-gold text-white ${gameState !== 'drawing' ? 'scale-110' : ''}`;
        if (isDrawn) return 'bg-red-800 text-white animate-fade-in';
        
        return 'bg-gray-700 text-gray-200 hover:bg-gray-600';
    };
        
    const buttonText = useMemo(() => {
        if (isFreePlay) return `Use Free Play (${freePlays})`;
        return `Start Draw (${selectedNumbers.length}/10)`;
    }, [isFreePlay, freePlays, selectedNumbers.length]);

    const handleBetChange = (direction: 'increase' | 'decrease') => {
        const currentIndex = betSteps.indexOf(betAmount);
        if (direction === 'increase' && currentIndex < betSteps.length - 1) {
            setBetAmount(betSteps[currentIndex + 1]);
        }
        if (direction === 'decrease' && currentIndex > 0) {
            setBetAmount(betSteps[currentIndex - 1]);
        }
    };
    
    const handleMaxBet = () => {
        setBetAmount(betSteps[betSteps.length - 1]);
    };


    return (
        <Card>
            {showBonusPopup && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowBonusPopup(false)}>
                    <Card className="bg-gray-800 border-2 border-old-gold max-w-md text-center p-8 transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                        <h2 className="text-4xl font-black text-old-gold uppercase tracking-wider mb-4" style={{textShadow: '2px 2px 4px #000'}}>Bonus Win!</h2>
                        <FaCoins className="h-24 w-24 mx-auto mb-4 text-yellow-400 animate-pulse"/>
                        <p className="text-2xl text-white">The draw revealed {bonusWinInfo.hits} bonus coins!</p>
                        <p className="text-3xl font-bold text-white mt-2">You've won <span className="text-yellow-400">{bonusWinInfo.plays} FREE PLAYS!</span></p>
                        <Button onClick={() => setShowBonusPopup(false)} className="mt-8 text-lg px-8">Awesome!</Button>
                    </Card>
                </div>
            )}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-old-gold mb-2 lg:mb-0">Buffalo Keno</h1>
                <div className="text-white text-lg">
                    Balance: {casinoState[coinType].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm text-gray-400">{coinType}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
                <div className="lg:col-span-2">
                    <p className="text-gray-400 mb-4 text-center lg:text-left">Select up to 10 numbers. Hit Coin spots for FREE PLAYS!</p>

                    <div className="max-w-md mx-auto lg:mx-0">
                        <div className="grid grid-cols-8 sm:grid-cols-10 gap-1 mb-4">
                            {[...Array(80)].map((_, i) => {
                                const num = i + 1;
                                const isSelected = selectedNumbers.includes(num);
                                const isDrawn = drawnNumbers.includes(num);
                                const isMatched = isSelected && isDrawn;
                                const isMissedHit = isDrawn && !isSelected;
                                const isCoin = coinSpots.includes(num);

                                let cellContent;

                                if (isMissedHit) {
                                    if (isCoin) {
                                        cellContent = <FaCoins className="w-full h-full object-contain p-1.5 text-yellow-300 animate-pulse" />;
                                    } else {
                                        cellContent = <BuffaloSkullIcon className="w-full h-full p-1.5 text-gray-400" />;
                                    }
                                } else {
                                    let coinOverlay = null;
                                    if (isCoin) {
                                        const coinColor = isMatched ? 'text-charcoal/50' : 'text-yellow-500/80';
                                        coinOverlay = <FaCoins className={`absolute inset-0 w-full h-full object-contain p-1.5 ${coinColor}`} />;
                                    }
                                    
                                    cellContent = (
                                        <>
                                            <span className={isCoin ? 'opacity-25' : ''}>{num}</span>
                                            {coinOverlay}
                                        </>
                                    );
                                }

                                return (
                                    <button
                                        key={num}
                                        onClick={() => toggleNumber(num)}
                                        disabled={gameState === 'drawing'}
                                        className={`relative aspect-square rounded flex items-center justify-center font-bold transition-all duration-200 text-[10px] sm:text-xs ${getNumberClass(num)}`}
                                    >
                                        {cellContent}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="min-h-[6rem] flex flex-col items-center justify-center my-4 text-center">
                        {gameState === 'drawing' && (
                            <div className="text-xl font-bold text-white animate-pulse">Drawing {drawnNumbers.length} of 20 numbers...</div>
                        )}
                        {gameState === 'result' && (
                            <Card className="bg-gray-900/50 animate-fade-in w-full py-2">
                                <h3 className="text-xl font-bold text-white">
                                    Draw Complete! You matched <span className="text-old-gold">{matchedNumbers.length}</span> out of <span className="text-old-gold">{selectedNumbers.length}</span>.
                                </h3>
                                {lastWinAmount > 0 ? (
                                    <p className="text-2xl text-green-400 font-bold mt-1">You won {lastWinAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}!</p>
                                ) : (
                                     <p className="text-2xl text-red-400 font-bold mt-1">No win this round.</p>
                                )}
                            </Card>
                        )}
                    </div>

                    <Card className="bg-gray-900/50 p-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-300">Quick:</span>
                                <Button onClick={handleQuickPick} variant="secondary" className="px-2 py-1 text-xs" disabled={isInteractionDisabled}>Pick 10</Button>
                                <Button onClick={handleClear} variant="secondary" className="px-2 py-1 text-xs" disabled={isInteractionDisabled}>Clear</Button>
                                <div className="text-xs text-gray-400 ml-2 font-mono">
                                    RTP (1k): {rtp !== null ? `${rtp.toFixed(2)}%` : 'N/A'}
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-4">
                               <div className="flex items-center gap-2">
                                    <label className="text-white font-semibold hidden sm:inline">Bet:</label>
                                    <div className="flex items-center bg-gray-800 border border-gray-600 rounded-md">
                                        <button
                                            onClick={() => handleBetChange('decrease')}
                                            disabled={isInteractionDisabled || isFreePlay || betAmount === betSteps[0]}
                                            className="px-3 py-1 text-white text-lg font-bold hover:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-l-md transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1 text-white font-semibold w-28 text-center tabular-nums">
                                            {betAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                        <button
                                            onClick={() => handleBetChange('increase')}
                                            disabled={isInteractionDisabled || isFreePlay || betAmount === betSteps[betSteps.length - 1]}
                                            className="px-3 py-1 text-white text-lg font-bold hover:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-r-md transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        onClick={handleMaxBet}
                                        disabled={isInteractionDisabled || isFreePlay}
                                        className="px-3 py-2 text-xs"
                                    >
                                        Max Bet
                                    </Button>
                               </div>
                               <div className="relative bg-gray-700 rounded-full p-1 flex items-center w-52">
                                    <div className={`absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full transition-transform duration-300 ease-in-out ${coinType === CoinType.GOLD ? 'bg-old-gold' : 'bg-blue-500'}`}
                                         style={{ transform: coinType === CoinType.BUFFALO ? 'translateX(calc(100% + 2px))' : 'translateX(4px)' }} />
                                    <button onClick={() => !(isInteractionDisabled || isFreePlay) && setCoinType(CoinType.GOLD)} className="flex-1 relative z-10 py-1 text-sm font-semibold flex items-center justify-center gap-1 transition-colors disabled:cursor-not-allowed" disabled={isInteractionDisabled || isFreePlay}>
                                        <FaCoins className={coinType === CoinType.GOLD ? 'text-charcoal' : 'text-yellow-400'}/> <span className={coinType === CoinType.GOLD ? 'text-charcoal' : 'text-white'}>Gold</span>
                                    </button>
                                    <button onClick={() => !(isInteractionDisabled || isFreePlay) && setCoinType(CoinType.BUFFALO)} className="flex-1 relative z-10 py-1 text-sm font-semibold flex items-center justify-center gap-1 transition-colors disabled:cursor-not-allowed" disabled={isInteractionDisabled || isFreePlay}>
                                        <img src="https://i.ibb.co/3Wf0G5G/buffalo-logo.png" alt="B" className={`h-4 w-4 transition-all ${coinType === CoinType.BUFFALO ? 'brightness-0 invert' : ''}`}/> <span className={coinType === CoinType.BUFFALO ? 'text-white' : 'text-white'}>Buffalo</span>
                                    </button>
                               </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <Button 
                                    onClick={handleStartDraw} 
                                    disabled={isInteractionDisabled || (selectedNumbers.length === 0 && !isFreePlay) || (betAmount <= 0 && !isFreePlay) || (casinoState[coinType] < betAmount && !isFreePlay)}
                                    className="w-full sm:w-auto px-6 py-2"
                                    variant={isFreePlay ? 'success' : 'primary'}
                                >
                                    {buttonText}
                                </Button>
                                 {casinoState[coinType] < betAmount && !isFreePlay && gameState === 'betting' && <span className="text-red-500 text-xs mt-1">Insufficient funds</span>}
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-1 mt-6 lg:mt-0">
                    <Payouts picks={selectedNumbers.length} />
                </div>
            </div>
        </Card>
    );
};
export default KenoPage;
