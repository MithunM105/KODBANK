import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import confetti from 'canvas-confetti';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const BrandFooter = () => (
    <div className="brand-footer">
        <div className="brand-signature">
            created by MITHUN, <span className="brand-id">id:KOD6W5HAZ</span>
        </div>
    </div>
);

const useAnimatedNumber = (value, duration = 1000) => {
    const [displayValue, setDisplayValue] = useState(value);
    const startValue = useRef(value);
    const startTime = useRef(null);

    useEffect(() => {
        startTime.current = performance.now();
        startValue.current = displayValue;

        let animationFrame;
        const animate = (now) => {
            const elapsed = now - startTime.current;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = startValue.current + (value - startValue.current) * ease;

            setDisplayValue(current);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [value]);

    return displayValue;
};

const DebitCard = ({ username, isFlipped, onClick }) => (
    <div className="debit-card-wrapper" onClick={onClick} style={{ position: 'relative' }}>
        <div className={`debit-card ${isFlipped ? 'is-flipped' : ''}`}>
            <div className="orange-lightning-border"></div>
            <div className="card-face card-front">
                <div className="card-logo" style={{ background: 'none', webkitTextFillColor: 'white', color: 'white', textShadow: 'none' }}>KODBANK</div>
                <div className="card-chip"></div>
                <div className="card-number">4582 1234 5678 9012</div>
                <div className="card-info">
                    <div className="card-holder">
                        <div>CARD HOLDER</div>
                        <div className="card-holder-name">{username?.toUpperCase() || 'MITHUN'}</div>
                    </div>
                    <div className="card-expiry">
                        <div>EXPIRES</div>
                        <div style={{ fontWeight: 700, color: 'white' }}>12/28</div>
                    </div>
                </div>
            </div>
            <div className="card-face card-back">
                <div className="card-strip"></div>
                <div className="card-cvv-strip">842</div>
                <div style={{ padding: '0 1rem', fontSize: '0.66rem', color: 'rgba(255,255,255,0.6)' }}>
                    This card is property of KODBANK SECURE BANKING. If found, please return to any authorized terminal layer. Unauthorized use is subject to account termination.
                </div>
            </div>
        </div>
    </div>
);

const FloatingNav = ({ activeTab, setActiveTab, setHistoryFilter }) => (
    <div className="floating-nav">
        {[
            { id: 'home', icon: '⌂', label: 'Home' },
            { id: 'investment', icon: '◈', label: 'Invest' },
            { id: 'cashback', icon: '💰', label: 'Cashback' },
            { id: 'loans', icon: '৳', label: 'Loans' },
            { id: 'history', icon: '☰', label: 'History' }
        ].map(tab => (
            <div key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => {
                setActiveTab(tab.id);
                if (tab.id !== 'history') setHistoryFilter('all');
            }}>
                <div className="nav-icon">{tab.icon}</div>
                <div className="nav-label">{tab.label}</div>
            </div>
        ))}
    </div>
);


const SpinWheel = ({ onSpin, isSpinning, resultIndex, spinsLeft, coins }) => {
    const segments = [
        "Upto $50", "Flat $33", "Upto 5000 Coins", "Flat 15k Coins", "Flat 3k Coins", "Better Luck"
    ];

    const getRotation = () => {
        if (resultIndex === null && !isSpinning) return 0;
        if (resultIndex === null && isSpinning) return 80; // Larger immediate jolt
        const totalSpins = 10; // High intensity
        return (360 * totalSpins) - (resultIndex * 60);
    };

    // Lively Sound effect logic (Dynamic Ticking)
    useEffect(() => {
        if (isSpinning) {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            let tickCount = 0;
            const playTick = () => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400 + Math.random() * 200, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.05);
            };

            let currentDelay = 50;
            const triggerNextTick = () => {
                if (!isSpinning) return;
                playTick();
                tickCount++;
                currentDelay = 50 + (tickCount * 2.5);
                if (currentDelay < 400) {
                    setTimeout(triggerNextTick, currentDelay);
                }
            };
            triggerNextTick();
            return () => { audioCtx.close().catch(() => {}); };
        }
    }, [isSpinning]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', position: 'relative' }}>
            <div className="wheel-outer" style={{ position: 'relative', padding: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', boxShadow: '0 0 40px rgba(188,19,254,0.2)' }}>
                <div className="wheel-lightning-border"></div>
                <div className="wheel-shimmer"></div>
                <div className="wheel-container" style={{
                    width: '420px',
                    height: '420px',
                    borderRadius: '50%',
                    position: 'relative',
                    overflow: 'hidden',
                    transform: `rotate(${getRotation()}deg)`,
                    transition: isSpinning ? (resultIndex === null ? 'transform 0.5s ease-out' : 'transform 7s cubic-bezier(0.1, 0, 0, 1)') : 'none',
                    border: '8px solid #1a1a1a',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
                }}>
                    {segments.map((s, i) => (
                        <div key={i} className="segment" style={{
                            transform: `rotate(${i * 60}deg)`,
                            background: [
                                'linear-gradient(to bottom, #1a0a2a, #000)', // Rich Dark
                                'linear-gradient(to bottom, #d4af37, #aa8405)', // Classic Gold
                                'linear-gradient(to bottom, #1e3c72, #2a5298)', // Royal Blue
                                'linear-gradient(to bottom, #B22222, #8B0000)', // Classic Red
                                'linear-gradient(to bottom, #228B22, #006400)', // Forest Green
                                'linear-gradient(to bottom, #4B0082, #240041)', // Deep Indigo
                            ][i],
                            borderRight: '2px solid rgba(255,255,255,0.1)'
                        }}>
                            <div className="segment-label" style={{ 
                                transform: 'rotate(0deg)',
                                fontFamily: '"Playfair Display", "Georgia", serif',
                                letterSpacing: '0'
                            }}>{s}</div>
                        </div>
                    ))}
                    <div className="wheel-center" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', zIndex: 10, border: '4px solid #fff', boxShadow: '0 0 20px rgba(188,19,254,0.8)' }}></div>
                </div>
                <div className="wheel-pointer" style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', width: '0', height: '0', borderLeft: '20px solid transparent', borderRight: '20px solid transparent', borderTop: '40px solid var(--secondary)', zIndex: 100, filter: 'drop-shadow(0 0 10px var(--secondary))' }}></div>
            </div>

            <button
                className={`spin-btn ${isSpinning ? 'spinning' : ''}`}
                onClick={onSpin}
                disabled={isSpinning || spinsLeft <= 0 || coins < 3000}
            >
                {isSpinning ? 'SPINNING...' : (spinsLeft > 0 ? 'SPIN NOW' : 'NO SPINS')}
            </button>
            <div style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '2px', fontWeight: 800 }}>
                {spinsLeft} SPINS REMAINING • 3,000 COINS / SPIN
            </div>
        </div>
    );
};

const CashbackView = ({ rewards, onSpin, onRedeem }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [resultIndex, setResultIndex] = useState(null);
    const [redeemAmount, setRedeemAmount] = useState(0);

    const handleSpinClick = async () => {
        if (isSpinning || rewards.spinsLeft <= 0 || rewards.coins < 3000) return;
        
        // Instant lively reaction
        setIsSpinning(true);
        setResultIndex(null); // Clear previous
        
        try {
            const res = await onSpin();
            if (res && res.success) {
                // Once we have the result, the wheel "commits" to the path
                setResultIndex(res.result.index);
                
                // Allow completion
                setTimeout(() => {
                    setIsSpinning(false);
                    setResultIndex(null);
                }, 7800);
            } else {
                setIsSpinning(false);
            }
        } catch (e) {
            setIsSpinning(false);
        }
    };

    return (
        <div className="view-content glass-card purple-pink-theme" style={{ animation: 'fadeIn 0.5s ease', border: '1px solid var(--secondary)', background: 'rgba(188,19,254,0.05)' }}>
            <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--secondary)', fontWeight: 800, letterSpacing: '2px', marginBottom: '0.5rem' }}>CASHBACK STATUS: ACTIVE</div>
                    <h2>CASHBACK & REWARDS</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Interactive reward system - v4.5</p>
                </div>
                <button onClick={() => window.location.reload()} style={{ width: 'auto', padding: '8px 15px', background: 'rgba(255,255,255,0.05)', fontSize: '0.7rem' }}>REFRESH SYSTEM</button>
            </div>

            <div className="reward-pills">
                <div className="reward-pill">
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>CASHBACK WON</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>${(rewards?.won || 0).toLocaleString()}</div>
                </div>
                <div className="reward-pill">
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>TOTAL REDEEMED</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>${(rewards?.redeemed || 0).toLocaleString()}</div>
                </div>
                <div className="reward-pill">
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>YOUR COINS</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffd700' }}><span style={{ fontSize: '1.4rem' }}>⌬</span> {(rewards?.coins || 0).toLocaleString()}</div>
                </div>
            </div>

            {rewards.won > 0 && (
                <div className="redeem-slider-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Redeem Rewards</h3>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)' }}>${redeemAmount}</div>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max={rewards?.won || 0}
                        value={redeemAmount}
                        onChange={(e) => setRedeemAmount(parseFloat(e.target.value))}
                    />
                    <button
                        disabled={redeemAmount <= 0}
                        onClick={() => { onRedeem(redeemAmount); setRedeemAmount(0); }}
                        style={{ marginTop: '1rem' }}
                    >
                        Redeem to Main Balance
                    </button>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                        Notice: Redeemed funds transfer instantly to your main account balance.
                    </p>
                </div>
            )}

            <div className="glass-card" style={{ padding: '3rem', marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '2rem', textAlign: 'center', letterSpacing: '4px' }}>WHEEL OF FORTUNE</h3>
                <SpinWheel 
                    onSpin={handleSpinClick} 
                    isSpinning={isSpinning} 
                    resultIndex={resultIndex}
                    spinsLeft={rewards.spinsLeft}
                    coins={rewards.coins}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
                <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--success)' }}>$</span> CASH REWARDS
                    </h3>
                    <div className="history-ledger" style={{ marginTop: '1rem' }}>
                        {(rewards?.history || []).filter(r => r.type === 'Cash').map(r => (
                            <div key={r.id} className="history-item" style={{ padding: '12px' }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.label}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(r.date).toLocaleDateString()}</div>
                                </div>
                                <div style={{ fontWeight: 800, color: 'var(--success)', fontSize: '1.1rem' }}>+${r.amount}</div>
                            </div>
                        ))}
                        {(!rewards?.history || rewards.history.filter(r => r.type === 'Cash').length === 0) && <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '20px' }}>No cash wins yet.</p>}
                    </div>
                </div>

                <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <span style={{ fontSize: '1.2rem' }}>🪙</span> COIN LOGS
                    </h3>
                    <div className="history-ledger" style={{ marginTop: '1rem' }}>
                        {(rewards?.coinHistory || []).map(r => (
                            <div key={r.id} className="history-item" style={{ padding: '12px', border: '1px solid rgba(255,215,0,0.1)' }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.label}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(r.date).toLocaleDateString()}</div>
                                </div>
                                <div style={{ fontWeight: 800, color: r.type === 'Loss' ? 'var(--danger)' : '#ffd700', fontSize: '1.1rem' }}>
                                    {r.type === 'Loss' ? 'Better Luck' : `+${r.amount.toLocaleString()}`}
                                </div>
                            </div>
                        ))}
                        {(!rewards?.coinHistory || rewards.coinHistory.length === 0) && <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '20px' }}>No coin logs found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};


// Helper to decimate data for clean long-term views
const decimateData = (labels, points, factor) => {
    const resultLabels = [];
    const resultPoints = [];
    for (let i = 0; i < labels.length; i += factor) {
        resultLabels.push(labels[i]);
        resultPoints.push(points[i]);
    }
    // Ensure the last point is always included for accuracy
    if ((labels.length - 1) % factor !== 0) {
        resultLabels.push(labels[labels.length - 1]);
        resultPoints.push(points[labels.length - 1]);
    }
    return { labels: resultLabels, points: resultPoints };
};

const InvestmentView = ({ invData, selectedStock, setSelectedStock, onBuy, onSell }) => {
    const [timeRange, setTimeRange] = useState('1M');
    const stock = selectedStock ? invData.holdings.find(h => h.symbol === selectedStock) : null;

    const getFilteredData = (stockObj, range) => {
        if (!stockObj) return { labels: [], points: [] };
        if (range === '1D') {
            return {
                labels: stockObj.hourly.map(d => d.time),
                points: stockObj.hourly.map(d => d.value)
            };
        }

        const history = stockObj.history;
        let sliceCount = 30;
        if (range === '1W') sliceCount = 7;
        else if (range === '1M') sliceCount = 30;
        else if (range === '3M') sliceCount = 90;
        else if (range === '6M') sliceCount = 180;
        else if (range === '1Y') sliceCount = 365;
        else if (range === '5Y' || range === 'ALL') sliceCount = history.length;

        const sliced = history.slice(-sliceCount);
        let finalLabels = sliced.map(d => d.date);
        let finalPoints = sliced.map(d => d.value);

        // Apply decimation for long-term views to remove zigzag
        if (range === '1Y') return decimateData(finalLabels, finalPoints, 7); // weekly
        if (range === '5Y' || range === 'ALL') return decimateData(finalLabels, finalPoints, 30); // monthly

        return {
            labels: finalLabels,
            points: finalPoints
        };
    };

    const { labels, points } = getFilteredData(stock, timeRange);

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div className="view-header">
                <h2>Investment Portfolio</h2>
                <p style={{ color: 'var(--text-muted)' }}>Real-time asset management and growth tracking.</p>
            </div>

            {selectedStock && stock ? (
                <div className="glass-card" style={{ marginBottom: '3rem', padding: '3rem', animation: 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                        <div>
                            <button onClick={() => setSelectedStock(null)} style={{ width: 'auto', background: 'transparent', color: 'var(--primary)', padding: 0, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>← Back to Portfolio</button>
                            <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{stock.company}<span style={{ color: stock.color, fontSize: '1rem', marginLeft: '1rem' }}>({stock.symbol})</span></h2>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginBottom: '8px' }}>
                                <span className="pulse-dot"></span>
                                <span style={{ fontSize: '0.7rem', color: '#00ffa3', fontWeight: 800, letterSpacing: '2px' }}>LIVE MARKET</span>
                            </div>
                            <div style={{ fontSize: '3rem', fontWeight: 900 }}>${stock.currentPrice.toLocaleString()}</div>
                            <div style={{ fontSize: '1.1rem', color: stock.currentPrice > stock.boughtPrice ? '#00ffa3' : '#ff2d55' }}>
                                {stock.currentPrice > stock.boughtPrice ? '▲' : '▼'} {((stock.currentPrice - stock.boughtPrice) / stock.boughtPrice * 100).toFixed(2)}% Growth
                            </div>
                        </div>
                    </div>

                    <div className="time-toggles" style={{ marginBottom: '2rem' }}>
                        {['1D', '1W', '1M', '3M', '6M', '1Y', '5Y', 'ALL'].map(t => (
                            <button key={t} className={`toggle-btn ${timeRange === t ? 'active' : ''}`} onClick={() => setTimeRange(t)}>{t}</button>
                        ))}
                    </div>

                    <div style={{ height: '350px', margin: '2rem 0', background: 'rgba(255,255,255,0.01)', borderRadius: '20px', padding: '1.5rem' }}>
                        <Line
                            key={`${selectedStock}-${timeRange}`}
                            data={{
                                labels: labels,
                                datasets: [{
                                    label: 'Price History',
                                    data: points,
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    fill: true,
                                    tension: 0.4,
                                    pointRadius: (timeRange === '5Y' || timeRange === 'ALL' || points.length > 61) ? 0 : 4,
                                    pointBackgroundColor: '#ffffff',
                                    borderWidth: 3
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                                        titleColor: '#ffffff',
                                        borderColor: 'rgba(255, 255, 255, 0.2)',
                                        borderWidth: 1
                                    }
                                },
                                scales: {
                                    x: {
                                        grid: { display: false },
                                        ticks: {
                                            color: 'rgba(255,255,255,0.3)',
                                            maxTicksLimit: (timeRange === '5Y' || timeRange === 'ALL') ? 5 : (timeRange === '3M' || timeRange === '6M' || timeRange === '1Y' ? 4 : (timeRange === '1D' ? 6 : 8))
                                        }
                                    },
                                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.3)' } }
                                }
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>INITIAL INVESTMENT</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>${stock.investedAmount.toLocaleString()}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Bought on {stock.investedDate}</div>
                        </div>
                        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>SHARES HELD</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stock.shares} Units</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Avg Price: ${stock.boughtPrice.toFixed(2)}</div>
                        </div>
                        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>REALIZED PROFIT</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#00ffa3' }}>+${(stock.currentPrice * stock.shares - stock.investedAmount).toLocaleString()}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Net Portfolio Gain</div>
                        </div>
                    </div>

                    <TradingInterface stock={stock} onBuy={onBuy} onSell={onSell} />
                </div>
            ) : (
                <>
                    <div className="investment-summary-grid">
                        <div className="glass-card investment-card" style={{ position: 'relative' }}>
                            <div className="orange-lightning-border"></div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>CURRENT VALUATION</p>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--success)' }}>
                                ${invData?.currentValue?.toLocaleString()}
                            </div>
                            <div style={{ color: '#00ffa3', fontSize: '0.9rem' }}>
                                ▲ {invData?.increasePercentage}% Increase this year
                            </div>
                        </div>
                        <div className="glass-card investment-card" style={{ position: 'relative' }}>
                            <div className="pink-lightning-border"></div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>ASSET HOLDINGS OVERVIEW</p>
                            <div style={{ height: '150px' }}>
                                <Line
                                    data={{
                                        labels: invData?.trend?.map(d => d.date),
                                        datasets: [{
                                            data: invData?.trend?.map(d => d.value),
                                            borderColor: '#ffffff',
                                            borderWidth: 3,
                                            pointRadius: 0,
                                            fill: true,
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            tension: 0.4
                                        }]
                                    }}
                                    options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }}
                                />
                            </div>
                        </div>
                    </div>
                    <h3 style={{ marginBottom: '1.5rem' }}>Holdings Deep-Dive</h3>
                    <div className="asset-holdings-grid">
                        {invData?.holdings?.map(asset => (
                            <div key={asset.symbol} className="asset-card luxury-border" onClick={() => setSelectedStock(asset.symbol)} style={{ padding: '2rem', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, color: asset.color, fontSize: '1.2rem' }}>{asset.company}</div>
                                        <div style={{ background: `${asset.color}20`, padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', color: asset.color, display: 'inline-block' }}>{asset.symbol}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>${asset.currentPrice}</div>
                                        <div style={{ fontSize: '0.75rem', color: asset.currentPrice > asset.boughtPrice ? '#00ffa3' : '#ff2d55' }}>
                                            {asset.currentPrice > asset.boughtPrice ? `▲ $${(asset.currentPrice - asset.boughtPrice).toFixed(2)}` : `▼ $${(asset.boughtPrice - asset.currentPrice).toFixed(2)}`}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ height: '80px', margin: '1.5rem 0' }}>
                                    <Line
                                        key={asset.symbol}
                                        data={{
                                            labels: (Array.isArray(asset.history) ? asset.history.slice(-30) : [1, 2]).map((_, i) => i),
                                            datasets: [{
                                                data: (Array.isArray(asset.history) ? asset.history.slice(-30) : [asset.boughtPrice, asset.currentPrice]).map(d => d.value || d),
                                                borderColor: '#ffffff',
                                                borderWidth: 2,
                                                pointRadius: 0,
                                                tension: 0.4,
                                                fill: true,
                                                backgroundColor: 'rgba(255, 255, 255, 0.03)'
                                            }]
                                        }}
                                        options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', fontSize: '0.85rem' }}>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>INVESTED AMOUNT</div>
                                        <div style={{ fontWeight: 700 }}>${asset.investedAmount?.toLocaleString() || (asset.boughtPrice * asset.shares).toLocaleString()}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>PURCHASE DATE</div>
                                        <div style={{ fontWeight: 700 }}>{asset.investedDate || '2024-01-01'}</div>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right', marginTop: '1rem', fontSize: '0.8rem', color: asset.currentPrice > asset.boughtPrice ? '#00ffa3' : '#ff2d55' }}>
                                    View Live Details →
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div >
    );
};

const TradingInterface = ({ stock, onBuy, onSell }) => {
    const [units, setUnits] = useState(1);
    const [loading, setLoading] = useState(false);

    return (
        <div className="glass-card" style={{ padding: '2.5rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
            <h3 style={{ marginBottom: '2rem', textAlign: 'center', letterSpacing: '4px' }}>TRADE ASSET: {stock.symbol}</h3>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>EXECUTION PRICE</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800 }}>${stock.currentPrice.toLocaleString()}</div>
                </div>
                <div style={{ fontSize: '2rem', opacity: 0.2 }}>✕</div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>QUANTITY</div>
                    <input
                        type="number"
                        min="1"
                        value={units}
                        onChange={(e) => setUnits(parseInt(e.target.value) || 1)}
                        style={{ width: '100px', fontSize: '1.8rem', textAlign: 'center', background: 'transparent', margin: 0, padding: '10px' }}
                    />
                </div>
                <div style={{ fontSize: '2rem', opacity: 0.2 }}>=</div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>TOTAL VALUE</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>${(units * stock.currentPrice).toLocaleString()}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <button
                    disabled={loading}
                    onClick={async () => {
                        setLoading(true);
                        await onBuy(stock.symbol, units, stock.currentPrice);
                        setLoading(false);
                    }}
                    style={{ background: 'var(--success)', padding: '20px', borderRadius: '16px', boxShadow: '0 0 30px rgba(0,255,163,0.2)' }}
                >
                    BUY NOW
                </button>
                <button
                    disabled={loading || stock.shares < units}
                    onClick={async () => {
                        setLoading(true);
                        await onSell(stock.symbol, units, stock.currentPrice);
                        setLoading(false);
                    }}
                    style={{ background: 'rgba(255,45,85,0.1)', border: '2px solid var(--danger)', color: 'var(--danger)', padding: '20px', borderRadius: '16px' }}
                >
                    SELL ASSET
                </button>
            </div>
            {stock.shares < units && <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--danger)', fontSize: '0.8rem' }}>Insufficient units in portfolio for liquidation</p>}
        </div>
    );
};

const LoansView = ({ loanData, onApply }) => {
    const [applyingId, setApplyingId] = useState(null);

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div className="view-header">
                <h2>Loans & Credit</h2>
                <p style={{ color: 'var(--text-muted)' }}>Access banking capital based on your score.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '3rem' }}>
                <div className="glass-card credit-score-display">
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>CREDIT PURITY SCORE</p>
                    <div className="credit-score-value">{loanData?.creditScore}</div>
                    <p style={{ fontSize: '0.8rem', color: '#00ffa3', marginTop: '1rem' }}>AUTHORIZED FOR LOANS</p>
                </div>
                <div className="glass-card">
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>SCORE TRAJECTORY</p>
                    <div style={{ height: '150px' }}>
                        <Line
                            data={{
                                labels: loanData?.scoreTrend?.map(d => d.month),
                                datasets: [{
                                    data: loanData?.scoreTrend?.map(d => d.score),
                                    borderColor: '#00ffa3',
                                    borderWidth: 4,
                                    tension: 0.4,
                                    pointRadius: 4,
                                    pointBackgroundColor: '#00ffa3'
                                }]
                            }}
                            options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#888' } }, y: { display: false } } }}
                        />
                    </div>
                </div>
            </div>
            <h3 style={{ marginBottom: '1.5rem' }}>Available Loan Options</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {loanData?.availableLoans?.map(loan => (
                    <div key={loan.id} className="loan-card luxury-border">
                        <div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{loan.title}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>via {loan.provider}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${loan.maxAmount.toLocaleString()}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LIMIT</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 700 }}>{loan.interest}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>INTEREST</div>
                            </div>
                        </div>
                        <button
                            disabled={applyingId === loan.id}
                            onClick={async () => {
                                setApplyingId(loan.id);
                                await onApply(loan.id, loan.maxAmount);
                                setApplyingId(null);
                            }}
                            style={{ width: '100%', padding: '12px', background: 'rgba(188, 19, 254, 0.1)', border: '1px solid var(--primary)', boxShadow: 'none' }}
                        >
                            {applyingId === loan.id ? 'PROCESSING...' : 'Apply Now'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TransferView = ({ onBack, balance, onTransfer }) => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        // Fetch all registered users for quick selection
        const fetchContacts = async () => {
            const res = await fetch(`${API_BASE}/users/list`, { credentials: 'include' });
            if (res.ok) {
                const json = await res.json();
                setContacts(json);
            }
        };
        fetchContacts();
    }, []);

    useEffect(() => {
        if (recipient.length >= 3) {
            const delay = setTimeout(async () => {
                const res = await fetch(`${API_BASE}/users/search?query=${recipient}`, { credentials: 'include' });
                const json = await res.json();
                setSearchResults(json);
            }, 300);
            return () => clearTimeout(delay);
        } else {
            setSearchResults([]);
        }
    }, [recipient]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (parseFloat(amount) > balance) return setError('Insufficient balance');
        setLoading(true);
        setError('');
        // This will now trigger the mPIN flow in App.jsx
        await onTransfer({ recipient, amount, note });
        setLoading(false);
    };

    const getAvatarColor = (name) => {
        const colors = ['#bc13fe', '#ff007f', '#00ffa3', '#4285F4', '#FF9900'];
        const index = name.length % colors.length;
        return colors[index];
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div className="view-header">
                <button onClick={onBack} style={{ width: 'auto', background: 'transparent', padding: 0, color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>← Back</button>
                <h2>Transfer Funds</h2>
                <p style={{ color: 'var(--text-muted)' }}>Securely send money to any KODBANK account.</p>
            </div>

            <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2.5rem', border: '2px solid #ff2d55', position: 'relative' }}>
                <div className="bw-lightning-border"></div>
                {error && <div className="error-msg" style={{ marginBottom: '2rem' }}>{error}</div>}

                {contacts.length > 0 && recipient.length === 0 && (
                    <div style={{ marginBottom: '3rem' }}>
                        <label style={{ display: 'block', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>QUICK CONTACTS</label>
                        <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none' }}>
                            {contacts.map(c => (
                                <div key={c.username} onClick={() => setRecipient(c.username)} style={{ textAlign: 'center', cursor: 'pointer', minWidth: '70px' }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        background: `linear-gradient(45deg, ${getAvatarColor(c.username)}, rgba(255,255,255,0.1))`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 900,
                                        color: 'white',
                                        margin: '0 auto 0.5rem',
                                        border: '2px solid rgba(255,255,255,0.1)',
                                        transition: 'transform 0.2s'
                                    }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                                        {c.username[0].toUpperCase()}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{c.username}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>RECIPIENT USERNAME / EMAIL</label>
                        <input
                            type="text"
                            placeholder="Type to search users..."
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            required
                        />
                        {searchResults.length > 0 && (
                            <div style={{ marginTop: '5px', background: '#0a0a0f', borderRadius: '12px', border: '1px solid var(--glass-border)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                                {searchResults.map(u => (
                                    <div
                                        key={u.username}
                                        onClick={() => { setRecipient(u.username); setSearchResults([]); }}
                                        style={{ padding: '15px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '12px' }}
                                        onMouseOver={e => e.currentTarget.style.background = 'rgba(188,19,254,0.1)'}
                                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: getAvatarColor(u.username), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>{u.username[0].toUpperCase()}</div>
                                        <div>
                                            <div style={{ fontWeight: 800 }}>{u.username}</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{u.email}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>AMOUNT TO TRANSFER</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '15px', top: '14px', fontSize: '1.2rem', color: 'var(--primary)' }}>$</span>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                style={{ paddingLeft: '35px' }}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'rgba(0,255,163,0.6)', marginTop: '-1rem' }}>Available Balance: ${balance.toLocaleString()}</p>
                    </div>

                    <div style={{ marginBottom: '3rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>TRANSACTION NOTE (OPTIONAL)</label>
                        <input
                            type="text"
                            placeholder="Add a payment note..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    <button type="submit" disabled={loading} style={{ padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', fontWeight: 900, fontSize: '1.1rem' }}>
                        {loading ? 'PROCESSING...' : 'CONFIRM & SEND MONEY'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const HistoryView = ({ transactions }) => {
    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div className="view-header">
                <h2>Transaction History</h2>
                <p style={{ color: 'var(--text-muted)' }}>Secure record of all your banking transactions.</p>
            </div>
            <div className="history-ledger">
                {transactions?.map(t => (
                    <div key={t.id} className="history-item" style={{ position: 'relative', border: '1px solid var(--secondary)' }}>
                        <div className="green-lightning-border"></div>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: t.type === 'incoming' ? 'rgba(0,255,163,0.1)' : t.type === 'outgoing' ? 'rgba(255,45,85,0.1)' : 'rgba(188,19,254,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                {t.type === 'incoming' ? '↓' : t.type === 'outgoing' ? '↑' : '◈'}
                            </div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{t.category}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(t.date).toLocaleString()}</div>
                                {t.note && <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px', fontStyle: 'italic' }}>// {t.note}</div>}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: t.type === 'incoming' ? '#00ffa3' : t.type === 'outgoing' ? '#ff2d55' : '#bc13fe' }}>
                                {t.type === 'incoming' ? '+' : t.type === 'outgoing' ? '-' : ''}${t.amount.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>{t.status}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const HomeView = ({ data, isCardFlipped, setIsCardFlipped, showBalance, handleBalanceReveal, isBlasting, setTimeRange, timeRange, chartOptions, chartData, setActiveTab, homeFilter, setHomeFilter, balancePulse }) => {
    const filteredTransactions = homeFilter === 'all'
        ? data.transactions.slice(0, 6)
        : data.transactions.filter(t => t.type === homeFilter);

    return (
        <div className="dashboard-grid" style={{ animation: 'fadeIn 0.5s ease' }}>
            {data.rewards?.availableRewards?.length > 0 && (
                <div
                    className="glass-card"
                    onClick={() => setActiveTab('cashback')}
                    style={{
                        padding: '2rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                        border: '1px solid var(--secondary)',
                        marginBottom: '1rem',
                        gridColumn: '1 / -1',
                        animation: 'pulse 2s infinite'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ fontSize: '2.5rem' }}>🎁</div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--secondary)' }}>{data.rewards.availableRewards.length} NEW REWARDS AVAILABLE</div>
                            <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.9rem' }}>Tap to scratch and win cashback rewards.</p>
                        </div>
                    </div>
                    <div style={{ fontSize: '1.5rem', color: 'var(--secondary)' }}>❯</div>
                </div>
            )}

            <div
                className="glass-card"
                onClick={() => setActiveTab('transfer')}
                style={{
                    padding: '2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(90deg, rgba(255,215,0,0.05) 0%, rgba(0,0,0,0.2) 100%)',
                    border: '2px solid #ffd700',
                    marginBottom: '1rem',
                    gridColumn: '1 / -1',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div className="bw-lightning-border"></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 2 }}>
                    <div style={{ fontSize: '2.5rem', animation: 'pulse 2s infinite' }}>💸</div>
                    <div>
                        <div style={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: '4px', color: 'white', textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>SEND MONEY</div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>INSTANT BANK-TO-BANK SETTLEMENT</p>
                    </div>
                    <div style={{ marginLeft: '2rem', fontSize: '1.2rem', color: '#ffd700' }}>▶▶</div>
                </div>
            </div>

            <div className="hero-stats-container">
                <DebitCard username={data.username} isFlipped={isCardFlipped} onClick={() => setIsCardFlipped(!isCardFlipped)} />
                <div className="glass-card balance-card-mini" style={{ position: 'relative' }}>
                    <div className="pink-lightning-border"></div>
                    <p style={{ color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>PRIMARY ACCOUNT BALANCE</p>
                    <div
                        className={`balance-reveal-mini ${!showBalance ? 'masked-balance' : ''} ${isBlasting ? 'blast-active' : ''} ${balancePulse ? 'balance-update-pulse' : ''}`}
                        onClick={handleBalanceReveal}
                        style={{ cursor: 'pointer', transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', userSelect: 'none' }}
                    >
                        {showBalance ? `$${data.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '$ ○○○○○○'}
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <div>ACC: {data.accountNumber}</div>
                        <div>IFSC: {data.ifsc}</div>
                    </div>
                    <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.6 }}>{showBalance ? 'Click to hide balance' : 'Click to reveal balance'}</p>
                </div>
            </div>

            <div className="glass-card attractive-chart-bg" style={{ gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3>Financial Trends</h3>
                    <div className="time-toggles">
                        {['1D', '1W', '1M', '3M', '6M', '1Y', '5Y', 'ALL'].map(t => (
                            <button key={t} className={`toggle-btn ${timeRange === t ? 'active' : ''}`} onClick={() => setTimeRange(t)}>{t}</button>
                        ))}
                    </div>
                </div>
                <div className="chart-container"><Line options={chartOptions} data={chartData} /></div>
            </div>

            <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem' }}>Financial Breakdown</h3>
                    {homeFilter !== 'all' && (
                        <button onClick={() => setHomeFilter('all')} style={{ width: 'auto', background: 'transparent', padding: 0, color: 'var(--primary)', fontSize: '0.8rem' }}>
                            Reset Highlights
                        </button>
                    )}
                </div>
                <div className="stats-column-grid">
                    {[
                        { key: 'incoming', label: 'Incoming', value: data.trends.incoming, color: '#00ffa3', icon: '↓' },
                        { key: 'outgoing', label: 'Outgoing', value: '#ff2d55', valueNum: data.trends.outgoing, icon: '↑' },
                        { key: 'investment', label: 'Investment', value: '#bc13fe', valueNum: data.trends.investment, icon: '◈' }
                    ].map(stat => (
                        <div key={stat.key} className={`compact-stat-card ${homeFilter === stat.key ? 'active-gradient' : ''}`} onClick={() => setHomeFilter(stat.key)} style={{ cursor: 'pointer', position: 'relative' }}>
                            <div className="orange-lightning-border"></div>
                            <div className="stat-icon-mini" style={{ background: `${stat.color || stat.value}15`, color: stat.color || stat.value }}>
                                {stat.icon}
                            </div>
                            <div className="stat-label-mini">{stat.label}</div>
                            <div className="stat-value-mini" style={{ color: stat.color || stat.value }}>
                                ${(stat.valueNum || stat.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.5rem' }}>{homeFilter !== 'all' ? `${homeFilter.charAt(0).toUpperCase() + homeFilter.slice(1)} Transactions` : 'Recent Activity'}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', background: 'rgba(188,19,254,0.1)', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold' }}>{homeFilter === 'all' ? 'LIVE FEED' : 'FILTERED'}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {filteredTransactions.map(t => (
                        <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: t.type === 'incoming' ? 'rgba(0,255,163,0.1)' : t.type === 'outgoing' ? 'rgba(255,45,85,0.1)' : 'rgba(188,19,254,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{t.type === 'incoming' ? '↓' : t.type === 'outgoing' ? '↑' : '◈'}</div>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '1.05rem' }}>{t.category}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(t.date).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: '700', fontSize: '1.1rem', color: t.type === 'incoming' ? 'var(--success)' : t.type === 'outgoing' ? 'var(--danger)' : 'var(--primary)' }}>{t.type === 'outgoing' ? '-' : '+'}${t.amount.toLocaleString()}</div>
                            </div>
                        </div>
                    ))}
                    {filteredTransactions.length === 0 && <p style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', textAlign: 'center' }}>No transactions found for this category.</p>}
                </div>
                <button onClick={() => setActiveTab('history')} style={{ marginTop: '2.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', width: 'auto', padding: '10px 20px' }}>
                    View Complete Transaction Archives
                </button>
            </div>
        </div>
    );
};

const API_BASE = '/api';

function App() {
    const [view, setView] = useState('login');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [authEmail, setAuthEmail] = useState('');

    // Auth States
    const [regData, setRegData] = useState({ username: '', email: '', password: '', phone: '' });
    const [loginData, setLoginData] = useState({ identifier: '', password: '' });
    const [otp, setOtp] = useState('');
    const [userAvailable, setUserAvailable] = useState(null);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [mpin, setMpin] = useState('');
    const [confirmMpin, setConfirmMpin] = useState('');
    const [verifyMpin, setVerifyMpin] = useState('');
    const [showMpinPad, setShowMpinPad] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    useEffect(() => {
        if (view === 'register' && regData.username.length >= 5) {
            const delayDebounce = setTimeout(async () => {
                const res = await fetch(`${API_BASE}/check-username?username=${regData.username}`);
                const json = await res.json();
                setUserAvailable(json.available);
            }, 500);
            return () => clearTimeout(delayDebounce);
        } else {
            setUserAvailable(null);
        }
    }, [regData.username, view]);

    // Dashboard States
    const [data, setData] = useState(null);
    const [showBalance, setShowBalance] = useState(false);
    const [isBlasting, setIsBlasting] = useState(false);
    const [timeRange, setTimeRange] = useState('Weekly');
    const [sessionDuration, setSessionDuration] = useState('00:00:00');
    const [statFilter, setStatFilter] = useState('all');
    const [customRange, setCustomRange] = useState({ start: '', end: '' });
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    const [activeTab, setActiveTab] = useState('home');
    const [historyFilter, setHistoryFilter] = useState('all');
    const [homeFilter, setHomeFilter] = useState('all');
    const [selectedStock, setSelectedStock] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [winningAmount, setWinningAmount] = useState(null);
    const [showWinOverlay, setShowWinOverlay] = useState(false);
    const [showSentOverlay, setShowSentOverlay] = useState(false);
    const [sentDetails, setSentDetails] = useState({ amount: 0, recipient: '' });
    const [balancePulse, setBalancePulse] = useState(false);
    const [mpinAction, setMpinAction] = useState(null);
    const [pendingTransferData, setPendingTransferData] = useState(null);
    const [pendingTradeData, setPendingTradeData] = useState(null);
    const [isMpinSuccess, setIsMpinSuccess] = useState(false);
    const [isProcessingTransfer, setIsProcessingTransfer] = useState(false);
    const [transferSuccessTick, setTransferSuccessTick] = useState(false);

    // Auto-redirect for Overlays (Vanish after 5s)
    useEffect(() => {
        let timer;
        if (showWinOverlay) {
            timer = setTimeout(() => {
                setShowWinOverlay(false);
                setActiveTab('cashback');
                fetchDashboard();
            }, 5000); 
        }
        return () => clearTimeout(timer);
    }, [showWinOverlay]);

    useEffect(() => {
        let timer;
        if (showSentOverlay) {
            timer = setTimeout(() => {
                setShowSentOverlay(false);
                setActiveTab('home');
                fetchDashboard();
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [showSentOverlay]);

    useEffect(() => {
        if (data?.notifications) {
            setNotifications(data.notifications);
        }
    }, [data?.notifications]);

    useEffect(() => {
    }, []);



    const handleTransfer = (transferData) => {
        setPendingTransferData(transferData);
        setMpinAction('transfer');
        setShowMpinPad(true);
        return false; // Stay in view until mPIN is verified
    };

    const executeTransfer = async (transferData) => {
        setIsProcessingTransfer(true);
        try {
            const res = await fetch(`${API_BASE}/transfer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transferData),
                credentials: 'include'
            });
            const json = await res.json();
            if (json.success) {
                setTransferSuccessTick(true);
                setTimeout(() => {
                    setSentDetails({ amount: transferData.amount, recipient: transferData.recipient });
                    setShowSentOverlay(true);
                    setIsProcessingTransfer(false);
                    setTransferSuccessTick(false);
                    // Transfer blast
                    confetti({
                        particleCount: 200,
                        spread: 100,
                        origin: { y: 0.6 },
                        colors: ['#bc13fe', '#ff007f', '#00ffa3']
                    });
                }, 1500);

                await fetchDashboard();
                return true;
            } else {
                setError(json.message || 'Transfer failed');
                setIsProcessingTransfer(false);
                return false;
            }
        } catch (err) {
            console.error(err);
            setIsProcessingTransfer(false);
            return false;
        }
    };

    const handleTradeBuy = (symbol, shares, price) => {
        setPendingTradeData({ symbol, shares, price });
        setMpinAction('buy-asset');
        setShowMpinPad(true);
    };

    const executeTradeBuy = async (tradeData) => {
        const { symbol, shares, price } = tradeData;
        try {
            const res = await fetch(`${API_BASE}/invest/buy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol, shares, price }),
                credentials: 'include'
            });
            const json = await res.json();
            if (json.success) {
                setSuccessMsg(`BOUGHT ${shares} UNITS OF ${symbol}`);
                setTimeout(() => setSuccessMsg(''), 5000);
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 },
                    colors: ['#bc13fe', '#00ffa3']
                });
                await fetchDashboard();
                return true;
            } else {
                setError(json.message);
                return false;
            }
        } catch (err) {
            setError("TRADE PROTOCOL FAILED");
            return false;
        }
    };

    const handleTradeSell = (symbol, shares, price) => {
        setPendingTradeData({ symbol, shares, price });
        setMpinAction('sell-asset');
        setShowMpinPad(true);
    };

    const executeTradeSell = async (tradeData) => {
        const { symbol, shares, price } = tradeData;
        try {
            const res = await fetch(`${API_BASE}/invest/sell`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol, shares, price }),
                credentials: 'include'
            });
            const json = await res.json();
            if (json.success) {
                setSuccessMsg(`SOLD ${shares} UNITS OF ${symbol}`);
                setTimeout(() => setSuccessMsg(''), 5000);
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 },
                    colors: ['#ff007f', '#ffffff']
                });
                await fetchDashboard();
                return true;
            } else {
                setError(json.message);
                return false;
            }
        } catch (err) {
            setError("LIQUIDATION PROTOCOL FAILED");
            return false;
        }
    };

    const handleLoanApply = async (loanId, amount) => {
        try {
            const res = await fetch(`${API_BASE}/loans/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ loanId, amount }),
                credentials: 'include'
            });
            const json = await res.json();
            if (json.success) {
                setSuccessMsg(`LOAN DISBURSED: $${amount.toLocaleString()}`);
                setTimeout(() => setSuccessMsg(''), 5000);
                confetti({
                    particleCount: 250,
                    spread: 120,
                    origin: { y: 0.4 },
                    colors: ['#00ffa3', '#ffffff', '#bc13fe']
                });
                await fetchDashboard();
            } else {
                setError(json.message || 'Loan application failed');
            }
        } catch (err) {
            console.error("Loan error", err);
            setError("LOAN PROTOCOL TIMEOUT");
        }
    };

    const handleSpinExecuted = async () => {
        try {
            const res = await fetch(`${API_BASE}/reward/spin`, {
                method: 'POST',
                credentials: 'include'
            });
            const json = await res.json();
            
            if (json.success) {
                // Deduct coins and update spins immediately for UI feedback
                setData(prev => ({
                    ...prev,
                    rewards: {
                        ...prev.rewards,
                        coins: json.coins,
                        spinsLeft: json.spinsLeft
                    }
                }));

                const { result } = json;
                // Wait for high-intensity wheel animation before showing overlay
                setTimeout(() => {
                    const isWin = result.type !== 'loss';
                    setWinningAmount(isWin ? (result.type === 'cash' ? `${result.value} CASH` : `${result.value} COINS`) : null);
                    setShowWinOverlay(true);
                    
                    if (isWin) {
                        // BLAST for winner
                        confetti({
                            particleCount: 250,
                            spread: 120,
                            origin: { y: 0.5 },
                            colors: ['#d4af37', '#ffffff', '#bc13fe']
                        });
                        // Secondary blast
                        setTimeout(() => confetti({ particleCount: 150, origin: { y: 0.7 } }), 500);
                    }
                    
                    fetchDashboard();
                }, 7500); 
                return json;
            } else {
                setError(json.message);
                return false;
            }
        } catch (err) {
            setError("SPIN PROTOCOL FAILED");
            return false;
        }
    };

    const handleRedeem = async (amt) => {
        try {
            const res = await fetch(`${API_BASE}/reward/redeem`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: amt }),
                credentials: 'include'
            });
            const json = await res.json();
            if (json.success) {
                setBalancePulse(true);
                setTimeout(() => setBalancePulse(false), 2000);
                setSuccessMsg(`REDEEMED $${amt} TO CORE BALANCE`);
                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.8 }
                });
                await fetchDashboard();
            }
        } catch (err) {
            setError("REDEMPTION FAILED");
        }
    };

    const handleNotificationClick = (notif) => {
        if (notif.tab === 'cashback') {
            setActiveTab('home'); // Cashback is a section in home, but user wants it to go to cashbacks view
            // Actually CashbackView is a separate tab in my implementation?
            // checking activeTab check below: {activeTab === 'cashback' && <CashbackView ... />}
            setActiveTab('cashback');
        } else {
            setActiveTab(notif.tab);
        }
        setNotifications(prev => prev.filter(n => n.id !== notif.id));
        setShowNotifications(false);
    };

    useEffect(() => {
        const dq = document.cookie.split('; ').find(row => row.startsWith('dq='))?.split('=')[1];
        if (dq && view !== 'login') {
            fetchDashboard();
        }

        const interval = setInterval(() => {
            if (data?.loginTime) {
                const diff = new Date() - new Date(data.loginTime);
                const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
                const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
                const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
                setSessionDuration(`${h}:${m}:${s}`);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [data?.loginTime]);

    const fetchDashboard = async () => {
        try {
            const res = await fetch(`${API_BASE}/dashboard`, { credentials: 'include' });
            let json;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                json = await res.json();
            } else {
                const text = await res.text();
                console.error("Non-JSON response received:", text);
                throw new Error(`Server returned non-JSON response (${res.status})`);
            }

            if (res.ok) {
                setData(json);
                setUser(json.username);
                setView('dashboard');
            } else {
                setView('login');
            }
        } catch (err) {
            console.error(err);
            setError(`Dashboard Protocol Error: ${err.message}`);
        }
    };

    useEffect(() => {
        let interval;
        if (view === 'dashboard') {
            interval = setInterval(fetchDashboard, 10000); // Poll every 10s for live market
        }
        return () => clearInterval(interval);
    }, [view]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        if (regData.username.length < 5) return setError('Username must be 5+ characters');
        if (regData.password.length < 8) return setError('Password must be 8+ characters');
        if (!/[!@#$%^&*(),.?":{ }|<>]/.test(regData.password)) return setError('Add a special character');
        if (!/\d/.test(regData.password)) return setError('Add a number');
        if (userAvailable === false) return setError('Username is already taken');

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(regData)
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message);
            setAuthEmail(regData.email);
            setView('otp');
            setResendCooldown(60);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (resendCooldown > 0) return;
        try {
            const res = await fetch(`${API_BASE}/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: authEmail })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message);
            setResendCooldown(60);
            setError('New code sent! Check server console.');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: authEmail, otp }),
                credentials: 'include'
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message);
            setView('setup-mpin');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSetupMpin = async (e) => {
        e.preventDefault();
        if (mpin.length !== 4) return setError('mPIN must be 4 digits');
        setView('confirm-mpin');
        setError('');
    };

    const handleConfirmMpin = async (e) => {
        e.preventDefault();
        if (confirmMpin !== mpin) {
            setConfirmMpin('');
            return setError('mPINs do not match. Try again.');
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/setup-mpin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: authEmail, mpin })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message);

            setView('login');
            setSuccessMsg(`Account creation successful, ${regData.username}!`);
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#00ffa3', '#bc13fe', '#ffffff']
            });
            setMpin('');
            setConfirmMpin('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyMpinAction = async () => {
        if (verifyMpin.length !== 4 || loading) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/verify-mpin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mpin: verifyMpin }),
                credentials: 'include'
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message);

            setIsMpinSuccess(true);
            // Lock inputs and clear mpin immediately to prevent double submission
            const capturedData = pendingTransferData;
            const capturedAction = mpinAction;
            
            setTimeout(async () => {
                setShowMpinPad(false);
                setVerifyMpin('');
                setIsMpinSuccess(false);
                setLoading(false); // Only now allow other actions

                if (capturedAction === 'reveal-balance') {
                    revealBalanceEffect();
                } else if (capturedAction === 'transfer') {
                    executeTransfer(capturedData);
                } else if (capturedAction === 'buy-asset') {
                    executeTradeBuy(pendingTradeData);
                } else if (capturedAction === 'sell-asset') {
                    executeTradeSell(pendingTradeData);
                }
                setMpinAction(null);
                setPendingTradeData(null);
            }, 1000);
        } catch (err) {
            setError(err.message);
            setVerifyMpin('');
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
                credentials: 'include'
            });
            
            let json;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                json = await res.json();
            } else {
                const text = await res.text();
                console.error("Login failure body:", text);
                throw new Error(`Connection Error: Server returned ${res.status} (Not JSON)`);
            }

            if (!res.ok) throw new Error(json.message);
            setUser(json.username);
            await fetchDashboard();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch(`${API_BASE}/logout`, { method: 'POST', credentials: 'include' });
        setData(null);
        setUser(null);
        setView('login');
        document.cookie = "dq=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    };

    const revealBalanceEffect = () => {
        setIsBlasting(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#bc13fe', '#ff007f', '#ffffff']
        });
        setTimeout(() => {
            setShowBalance(true);
            setIsBlasting(false);
        }, 300);
    };

    const handleBalanceReveal = () => {
        if (!showBalance) {
            setMpinAction('reveal-balance');
            setShowMpinPad(true);
        } else {
            setShowBalance(false);
        }
    };

    // Prepare Chart Data (Dashboard Scope)
    let chartOptions = {};
    let chartData = { labels: [], datasets: [] };

    if (view === 'dashboard' && data) {
        let filteredLabels = [];
        let filteredPoints = [];

        if (timeRange === '1D') {
            filteredLabels = data.trends.hourly.map(d => d.time);
            filteredPoints = data.trends.hourly.map(d => d.value);
        } else if (timeRange === '1W') {
            filteredLabels = data.trends.weekly.map(d => d.date);
            filteredPoints = data.trends.weekly.map(d => d.value);
        } else {
            let sliceCount = 30;
            if (timeRange === '1M') sliceCount = 30;
            else if (timeRange === '3M') sliceCount = 90;
            else if (timeRange === '6M') sliceCount = 180;
            else if (timeRange === '1Y') sliceCount = 365;
            else if (timeRange === '5Y' || timeRange === 'ALL') sliceCount = data.trends.chartData.length;

            const sliced = data.trends.chartData.slice(-sliceCount);
            filteredLabels = sliced.map(d => d.date);
            filteredPoints = sliced.map(d => d.value);

            if (timeRange === '1Y') {
                const decimated = decimateData(filteredLabels, filteredPoints, 7);
                filteredLabels = decimated.labels;
                filteredPoints = decimated.points;
            } else if (timeRange === '5Y' || timeRange === 'ALL') {
                const decimated = decimateData(filteredLabels, filteredPoints, 30);
                filteredLabels = decimated.labels;
                filteredPoints = decimated.points;
            }
        }

        chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(12, 8, 20, 0.95)',
                    titleColor: '#ff007f',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255, 0, 127, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        color: 'rgba(255,255,255,0.3)',
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: (timeRange === '5Y' || timeRange === 'ALL') ? 5 : (timeRange === '3M' || timeRange === '6M' || timeRange === '1Y' ? 4 : (timeRange === '1D' ? 6 : 8))
                    }
                },
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.3)' } }
            }
        };

        chartData = {
            labels: filteredLabels,
            datasets: [{
                label: 'Portfolio Value',
                data: filteredPoints,
                borderColor: '#bc13fe',
                backgroundColor: 'rgba(188, 19, 254, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: (timeRange === '5Y' || timeRange === 'ALL' || filteredPoints.length > 60) ? 0 : 4,
                pointBackgroundColor: '#ff007f',
            }]
        };
    }

    // Win Blast Overlay Component (Card Style - Keyboard Size)
    // --- Reward Result Overlay (Restored for clear feedback) ---
    const WinBlastOverlay = () => {
        const isWin = winningAmount !== null;
        return (
            <div className="purple-pink-theme" style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                background: 'rgba(2,2,5,0.95)', zIndex: 99999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'fadeIn 0.4s ease-out', backdropFilter: 'blur(20px)'
            }}>
                <div className="glass-card" style={{
                    width: '100%', maxWidth: '400px', textAlign: 'center', padding: '3rem 2rem',
                    border: '1px solid ' + (isWin ? '#00ffa3' : '#ff2d55'), borderRadius: '32px',
                    boxShadow: isWin ? '0 0 50px rgba(0,255,163,0.2)' : '0 0 50px rgba(255,45,85,0.1)',
                    animation: 'bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                    <div style={{ fontSize: '1rem', color: isWin ? '#d4af37' : '#ff2d55', fontWeight: 900, letterSpacing: '4px', marginBottom: '2rem', fontFamily: 'serif' }}>
                        {isWin ? 'CONGRATULATIONS!' : 'OOPS!'}
                    </div>
                    <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>{isWin ? '🌟' : '💀'}</div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: 0, color: 'white', fontFamily: 'serif', lineHeight: 1.2, textShadow: isWin ? '0 0 15px rgba(0,255,163,0.3)' : 'none' }}>
                        {isWin ? `CONGRATULATIONS ${user?.toUpperCase()}!` : 'BETTER LUCK NEXT TIME'}
                    </h1>
                    {isWin && (
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#00ffa3', marginTop: '1rem', textShadow: '0 0 20px rgba(0,255,163,0.5)' }}>
                            YOU WON {winningAmount}
                        </div>
                    )}
                    <p style={{ color: 'var(--text-muted)', marginTop: '1.5rem', fontSize: '0.9rem', fontStyle: 'italic' }}>
                        {isWin ? 'CREDITED TO SECURE VAULT' : 'LUCK IS A ROTATING VARIABLE. TRY AGAIN.'}
                    </p>
                    <div style={{ color: 'rgba(255,255,255,0.4)', marginTop: '3rem', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 600 }}>
                        SECURELY SYNCING TO YOUR VAULT...
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.2)', marginTop: '1.5rem', fontSize: '0.65rem', letterSpacing: '2px' }}>
                        AUTO-CREDITING IN 5 SECONDS...
                    </div>
                </div>
            </div>
        );
    };

    const StatusStyles = () => (
        <style>{`
            @keyframes winFadeIn { from { opacity: 0; } to { opacity: 1; } }
            .pulse-success { animation: pulseAnim 2s infinite; }
            @keyframes pulseAnim {
                0% { box-shadow: 0 0 0 0 rgba(0,255,163,0.4); transform: scale(1); }
                70% { box-shadow: 0 0 0 20px rgba(0,255,163,0); transform: scale(1.05); }
                100% { box-shadow: 0 0 0 0 rgba(0,255,163,0); transform: scale(1); }
            }
        `}</style>
    );

    const SentBlastOverlay = () => (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'radial-gradient(circle at center, #0a1a0f 0%, #010401 100%)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'winFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            backdropFilter: 'blur(10px)'
        }}>
            <div style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem' }}>
                <div style={{ 
                    width: '140px', 
                    height: '140px', 
                    borderRadius: '50%', 
                    background: 'var(--success)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '5rem', 
                    margin: '0 auto 3rem', 
                    boxShadow: '0 0 60px rgba(0,255,163,0.5)',
                    animation: 'bounceIn 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>✓</div>
                
                <div style={{ fontSize: '1rem', color: '#00ffa3', fontWeight: 900, letterSpacing: '10px', marginBottom: '1.5rem', textTransform: 'uppercase', opacity: 0.8 }}>TRANSACTION SUCCESSFUL</div>
                <h1 style={{
                    fontSize: '6.5rem',
                    fontWeight: 900,
                    color: 'white',
                    margin: 0,
                    letterSpacing: '-2px',
                    textShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>${parseFloat(sentDetails.amount).toLocaleString()}</h1>
                <div style={{ fontSize: '1.8rem', marginTop: '1.5rem', color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>Transferred to <span style={{ color: 'white', fontWeight: 800 }}>{sentDetails.recipient}</span></div>
                
                <div className="pulse-success" style={{ 
                    marginTop: '4rem', 
                    padding: '20px 40px', 
                    background: 'rgba(0,255,163,0.05)', 
                    border: '1px solid rgba(0,255,163,0.3)', 
                    borderRadius: '50px', 
                    color: '#00ffa3', 
                    fontWeight: 800, 
                    fontSize: '0.9rem',
                    letterSpacing: '1px',
                    display: 'inline-block'
                }}>TRANSACTION PROCESSED SUCCESSFULLY</div>
                
                <div style={{ marginTop: '5rem' }}>
                    <button
                        onClick={() => { setShowSentOverlay(false); setActiveTab('home'); fetchDashboard(); }}
                        className="mpin-digit-btn"
                        style={{
                            background: 'white',
                            padding: '22px 60px',
                            borderRadius: '20px',
                            color: 'black',
                            fontWeight: 900,
                            fontSize: '1.2rem',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                            letterSpacing: '1px'
                        }}
                    >
                        GO TO DASHBOARD
                    </button>
                    <p style={{ marginTop: '1.5rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', fontWeight: 600 }}>TRANSACTION ID: TX{Date.now().toString().slice(-8)}</p>
                    <div style={{ color: 'rgba(0,255,163,0.4)', marginTop: '2rem', fontSize: '0.7rem', letterSpacing: '2px' }}>
                        AUTO-REDIRECTING TO DASHBOARD IN 5 SECONDS...
                    </div>
                </div>
            </div>
        </div>
    );

    // Final Render logic
    const renderContent = () => {
        if (view === 'dashboard' && data) {
            return (
                <div className="app-container" style={{ paddingBottom: '8rem' }}>
                    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>KODBANK SECURE</p>
                            <h1 style={{ fontSize: '2.4rem', textTransform: 'uppercase' }}>
                                {activeTab}<span style={{ color: 'var(--primary)' }}>.</span>
                            </h1>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
                            <div className="coin-display" onClick={() => setActiveTab('cashback')}>
                                <span>⌬</span>
                                <span>{data.rewards.coins?.toLocaleString()}</span>
                            </div>
                            <div className="notification-bell" style={{ fontSize: '1.5rem', cursor: 'pointer', position: 'relative', opacity: 0.8 }} onClick={() => setShowNotifications(!showNotifications)}>
                                🔔
                                {notifications.length > 0 && <div style={{ position: 'absolute', top: 0, right: 0, width: '10px', height: '10px', background: 'var(--danger)', borderRadius: '50%', border: '2px solid var(--bg)' }}></div>}
                            </div>
                            {showNotifications && (
                                <div className="glass-card notification-dropdown" style={{ position: 'absolute', top: '100%', right: 0, width: '300px', zIndex: 1000, marginTop: '1rem', padding: '1rem', animation: 'fadeInDown 0.3s ease' }}>
                                    <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Notifications</h4>
                                    {notifications.length > 0 ? notifications.map(n => (
                                        <div key={n.id} className="notif-item" onClick={() => handleNotificationClick(n)} style={{ padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.02)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <span style={{ fontSize: '1.2rem' }}>{n.icon}</span>
                                            <div style={{ fontSize: '0.85rem' }}>{n.message}</div>
                                        </div>
                                    )) : <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>No new updates.</div>}
                                </div>
                            )}
                            {activeTab === 'home' ? (
                                <button onClick={handleLogout} style={{ width: 'auto', padding: '12px 24px', background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.2)', color: 'var(--danger)', boxShadow: 'none' }}>Logout</button>
                            ) : (
                                <button onClick={() => setActiveTab('home')} style={{ width: 'auto', padding: '12px 24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', boxShadow: 'none' }}>← Back</button>
                            )}
                        </div>
                    </nav>

                    {activeTab === 'home' && (
                        <HomeView
                            data={data} isCardFlipped={isCardFlipped} setIsCardFlipped={setIsCardFlipped} showBalance={showBalance}
                            handleBalanceReveal={handleBalanceReveal} isBlasting={isBlasting} setTimeRange={setTimeRange}
                            timeRange={timeRange} chartOptions={chartOptions} chartData={chartData} setActiveTab={setActiveTab}
                            homeFilter={homeFilter} setHomeFilter={setHomeFilter} balancePulse={balancePulse}
                        />
                    )}
                    {activeTab === 'investment' && <InvestmentView invData={data.investments} selectedStock={selectedStock} setSelectedStock={setSelectedStock} onBuy={handleTradeBuy} onSell={handleTradeSell} />}
                    {activeTab === 'loans' && <LoansView loanData={data.loans} onApply={handleLoanApply} />}
                    {activeTab === 'history' && <HistoryView transactions={data.transactions} filter={historyFilter} />}
                    {activeTab === 'transfer' && <TransferView balance={data.balance} onBack={() => setActiveTab('home')} onTransfer={handleTransfer} />}
                    {activeTab === 'cashback' && <CashbackView rewards={data.rewards} onSpin={handleSpinExecuted} onRedeem={handleRedeem} />}

                    <FloatingNav activeTab={activeTab} setActiveTab={setActiveTab} setHistoryFilter={setHistoryFilter} />
                    <BrandFooter />

                    {showMpinPad && (
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(2,2,8,0.96)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)' }}>
                            <div className="glass-card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center', padding: '3rem 2rem', border: '1px solid rgba(188,19,254,0.3)', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', position: 'relative' }}>
                                {isMpinSuccess ? (
                                    <div style={{ padding: '2rem', animation: 'bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                                        <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #00ffa3, #00d186)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', margin: '0 auto 2rem', boxShadow: '0 0 30px rgba(0,255,163,0.4)' }}>✓</div>
                                        <h2 style={{ color: '#00ffa3', letterSpacing: '2px', fontWeight: 800 }}>VERIFIED</h2>
                                        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Please wait...</p>
                                    </div>
                                ) : (
                                    <>
                                        <button 
                                            onClick={() => setShowMpinPad(false)} 
                                            style={{ 
                                                position: 'absolute', 
                                                top: '30px', 
                                                left: '30px', 
                                                background: 'rgba(255,255,255,0.05)', 
                                                border: '1px solid rgba(255,255,255,0.1)', 
                                                color: 'white', 
                                                padding: '8px 15px', 
                                                borderRadius: '10px', 
                                                fontSize: '0.7rem', 
                                                fontWeight: 800,
                                                cursor: 'pointer',
                                                zIndex: 10
                                            }}
                                        >
                                            ← BACK
                                        </button>
                                        <div style={{ position: 'absolute', top: '20px', left: '0', width: '100%', fontSize: '0.7rem', color: 'var(--primary)', letterSpacing: '4px', fontWeight: 800, opacity: 0.6 }}>KODBANK SECURE BANKING</div>
                                        <h2 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>ENTER PIN</h2>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '0.9rem' }}>Security verification required</p>
                                        
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', marginBottom: '4rem' }}>
                                            {[0, 1, 2, 3].map(i => (
                                                <div key={i} style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    borderRadius: '50%',
                                                    background: verifyMpin.length > i ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                                    border: '2px solid ' + (verifyMpin.length > i ? 'var(--primary)' : 'rgba(255,255,255,0.1)'),
                                                    boxShadow: verifyMpin.length > i ? '0 0 20px var(--primary)' : 'none',
                                                    transform: verifyMpin.length === i ? 'scale(1.2)' : 'scale(1)',
                                                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                                }} />
                                            ))}
                                        </div>

                                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '3rem' }}>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                                <button key={n} 
                                                    onClick={() => !loading && verifyMpin.length < 4 && setVerifyMpin(prev => prev + n)} 
                                                    className="mpin-digit-btn" 
                                                    style={{ 
                                                        background: 'rgba(255,255,255,0.03)', 
                                                        fontSize: '1.8rem', 
                                                        borderRadius: '50%', 
                                                        width: '74px', 
                                                        height: '74px', 
                                                        margin: '0 auto',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        border: '1px solid rgba(255,255,255,0.05)',
                                                        color: 'white'
                                                    }}>{n}</button>
                                            ))}
                                            <button onClick={() => !loading && setVerifyMpin(prev => prev.slice(0, -1))} className="mpin-digit-btn" style={{ background: 'rgba(255,45,85,0.05)', fontSize: '1.4rem', color: 'var(--danger)', border: '1px solid rgba(255,45,85,0.1)', borderRadius: '50%', width: '74px', height: '74px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                ⌫
                                            </button>
                                            <button onClick={() => !loading && verifyMpin.length < 4 && setVerifyMpin(prev => prev + '0')} 
                                                className="mpin-digit-btn" 
                                                style={{ 
                                                    background: 'rgba(255,255,255,0.03)', 
                                                    fontSize: '1.8rem', 
                                                    borderRadius: '50%', 
                                                    width: '74px', 
                                                    height: '74px', 
                                                    margin: '0 auto',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: '1px solid rgba(255,255,255,0.05)',
                                                    color: 'white'
                                                }}>0</button>
                                            <button 
                                                onClick={() => verifyMpin.length === 4 && handleVerifyMpinAction()} 
                                                className="mpin-digit-btn" 
                                                style={{ 
                                                    background: verifyMpin.length === 4 ? 'rgba(0,255,163,0.1)' : 'rgba(255,255,255,0.02)', 
                                                    fontSize: '1.8rem', 
                                                    color: verifyMpin.length === 4 ? 'var(--success)' : 'rgba(255,255,255,0.1)', 
                                                    border: '1px solid ' + (verifyMpin.length === 4 ? 'var(--success)' : 'rgba(255,255,255,0.05)'), 
                                                    borderRadius: '50%', 
                                                    width: '74px', 
                                                    height: '74px', 
                                                    margin: '0 auto', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center' 
                                                }}
                                            >
                                                ✔
                                            </button>
                                        </div>
                                        
                                        <button 
                                            onClick={() => setShowMpinPad(false)} 
                                            style={{ 
                                                background: 'transparent', 
                                                fontSize: '0.75rem', 
                                                color: 'var(--text-muted)', 
                                                border: 'none', 
                                                boxShadow: 'none', 
                                                marginBottom: '1rem',
                                                letterSpacing: '2px',
                                                fontWeight: 800
                                            }}
                                        >
                                            CANCEL
                                        </button>

                                        <button
                                            onClick={handleVerifyMpinAction}
                                            disabled={verifyMpin.length !== 4 || loading}
                                            style={{
                                                padding: '20px',
                                                width: '100%',
                                                background: verifyMpin.length === 4 ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(255,255,255,0.05)',
                                                opacity: verifyMpin.length === 4 ? (loading ? 0.7 : 1) : 0.3,
                                                borderRadius: '16px',
                                                fontSize: '1rem',
                                                fontWeight: 800,
                                                letterSpacing: '2px',
                                                color: 'white',
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            {loading ? 'VERIFYING...' : 'CONFIRM TRANSACTION'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {isProcessingTransfer && (
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(2,2,5,0.98)', zIndex: 100001, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)' }}>
                            <div style={{ textAlign: 'center' }}>
                                {transferSuccessTick ? (
                                    <div style={{ animation: 'bounceIn 0.5s ease' }}>
                                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', margin: '0 auto 2rem' }}>✓</div>
                                        <h2 style={{ color: 'var(--success)', letterSpacing: '4px' }}>SUCCESSFUL</h2>
                                    </div>
                                ) : (
                                    <>
                                        <div className="processing-loader" style={{ width: '80px', height: '80px', border: '5px solid rgba(188,19,254,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 2rem' }}></div>
                                        <h2 style={{ letterSpacing: '2px' }}>TRANSFERRING FUNDS...</h2>
                                        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Securely sending to recipient bank account</p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="auth-page neon-theme">
                <div className="auth-card glass-card">
                    <div className="auth-header">
                        <h1>KODBANK<span style={{ color: 'var(--primary)' }}>.</span></h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>SECURE BANKING INTERFACE v4.2</p>
                    </div>

                    {error && <div className="error-msg">{error}</div>}
                    {successMsg && <div className="success-msg">{successMsg}</div>}

                    {view === 'login' && (
                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="input-group">
                                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1px' }}>
                                    <span>USERNAME / EMAIL</span>
                                    <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>[SECURE ID]</span>
                                </label>
                                <input type="text" placeholder="Username or Email" required value={loginData.identifier} onChange={e => setLoginData({ ...loginData, identifier: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1px' }}>
                                    <span>SECURE PASSWORD</span>
                                    <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>[MASKED]</span>
                                </label>
                                <input type="password" placeholder="Password" required value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
                            </div>
                            <button type="submit" disabled={loading} className="glow-on-hover" style={{ marginTop: '1rem' }}>
                                {loading ? 'SYNCING IDENTITY...' : 'SECURE CONNECT'}
                            </button>
                            <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                                New Agent? <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '900', letterSpacing: '1px' }} onClick={() => setView('register')}>REQUEST ACCESS</span>
                            </p>
                        </form>
                    )}

                    {view === 'register' && (
                        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="input-group">
                                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1px' }}>
                                    <span>USERNAME</span>
                                    {userAvailable === true && <span style={{ color: 'var(--success)' }}>AVAILABLE</span>}
                                    {userAvailable === false && <span style={{ color: 'var(--danger)' }}>ALREADY TAKEN</span>}
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Min 5 characters" 
                                        required 
                                        value={regData.username} 
                                        onChange={e => setRegData({ ...regData, username: e.target.value })}
                                        style={{ borderColor: userAvailable === true ? 'var(--success)' : (userAvailable === false ? 'var(--danger)' : '') }}
                                    />
                                    {userAvailable === true && <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--success)' }}>✓</span>}
                                    {userAvailable === false && <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--danger)' }}>✕</span>}
                                </div>
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1px' }}>
                                    <span>EMAIL ADDRESS</span>
                                    {regData.email && (
                                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regData.email) 
                                        ? <span style={{ color: 'var(--success)' }}>VALID EMAIL</span> 
                                        : <span style={{ color: 'var(--danger)' }}>INVALID FORMAT</span>
                                    )}
                                </label>
                                <input type="email" placeholder="Valid email address" required value={regData.email} onChange={e => setRegData({ ...regData, email: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1px' }}>
                                    <span>SECURE PASSWORD</span>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <span style={{ 
                                            padding: '2px 6px', 
                                            borderRadius: '4px', 
                                            fontSize: '0.6rem', 
                                            background: regData.password.length >= 8 ? 'rgba(0,255,163,0.1)' : 'rgba(255,45,85,0.1)',
                                            color: regData.password.length >= 8 ? '#00ffa3' : '#ff2d55',
                                            border: `1px solid ${regData.password.length >= 8 ? '#00ffa3' : '#ff2d55'}`
                                        }}>8+ CHARS</span>
                                        <span style={{ 
                                            padding: '2px 6px', 
                                            borderRadius: '4px', 
                                            fontSize: '0.6rem', 
                                            background: /\d/.test(regData.password) ? 'rgba(0,255,163,0.1)' : 'rgba(255,45,85,0.1)',
                                            color: /\d/.test(regData.password) ? '#00ffa3' : '#ff2d55',
                                            border: `1px solid ${/\d/.test(regData.password) ? '#00ffa3' : '#ff2d55'}`
                                        }}>NUMBER</span>
                                        <span style={{ 
                                            padding: '2px 6px', 
                                            borderRadius: '4px', 
                                            fontSize: '0.6rem', 
                                            background: /[!@#$%^&*()]/.test(regData.password) ? 'rgba(0,255,163,0.1)' : 'rgba(255,45,85,0.1)',
                                            color: /[!@#$%^&*()]/.test(regData.password) ? '#00ffa3' : '#ff2d55',
                                            border: `1px solid ${/[!@#$%^&*()]/.test(regData.password) ? '#00ffa3' : '#ff2d55'}`
                                        }}>SPECIAL</span>
                                    </div>
                                </label>
                                <input type="password" placeholder="Min 8 chars, 1 number, 1 special" required value={regData.password} onChange={e => setRegData({ ...regData, password: e.target.value })} 
                                    style={{ borderColor: (regData.password.length >= 8 && /\d/.test(regData.password) && /[!@#$%^&*()]/.test(regData.password)) ? '#00ffa3' : (regData.password ? '#ff2d55' : 'var(--glass-border)') }}
                                />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1px' }}>MOBILE PROTOCOL (PHONE)</label>
                                <input type="tel" placeholder="Phone number" required value={regData.phone} onChange={e => setRegData({ ...regData, phone: e.target.value })} />
                            </div>
                            <button type="submit" disabled={loading} className="glow-on-hover" style={{ marginTop: '1rem' }}>
                                {loading ? 'GENERATING PROTOCOLS...' : 'INITIALIZE AGENT'}
                            </button>
                            <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                                Agent recognized? <span style={{ color: 'var(--secondary)', cursor: 'pointer', fontWeight: '900', letterSpacing: '1px' }} onClick={() => setView('login')}>ESTABLISH CONNECTION</span>
                            </p>
                        </form>
                    )}

                    {view === 'otp' && (
                        <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>COMMUNICATION VERIFICATION</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>{authEmail}</p>
                            </div>
                            
                            <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1px' }}>6-DIGIT PROTOCOL CODE</label>
                                <input 
                                    type="text" 
                                    placeholder="000000" 
                                    maxLength="6"
                                    required 
                                    value={otp} 
                                    onChange={e => setOtp(e.target.value)} 
                                    style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px', fontWeight: 900 }}
                                />
                            </div>

                            <button type="submit" disabled={loading} className="glow-on-hover">
                                {loading ? 'VERIFYING...' : 'AUTHORIZE LOGIN'}
                            </button>

                            <div style={{ textAlign: 'center' }}>
                                {resendCooldown > 0 ? (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        RESEND AVAILABLE IN <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{resendCooldown}s</span>
                                    </p>
                                ) : (
                                    <span 
                                        onClick={handleResendOTP}
                                        style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', textDecoration: 'underline' }}
                                    >
                                        RESEND VERIFICATION CODE
                                    </span>
                                )}
                            </div>
                        </form>
                    )}

                    {(view === 'setup-mpin' || view === 'confirm-mpin') && (
                        <form onSubmit={view === 'setup-mpin' ? handleSetupMpin : handleConfirmMpin}>
                            <h3>{view === 'setup-mpin' ? 'Create mPIN' : 'Confirm mPIN'}</h3>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '2rem 0' }}>
                                {[0, 1, 2, 3].map(i => {
                                    const val = view === 'setup-mpin' ? mpin : confirmMpin;
                                    return <div key={i} style={{ width: '20px', height: '20px', borderRadius: '50%', background: val.length > i ? 'var(--primary)' : 'rgba(255,255,255,0.1)', border: '2px solid var(--glass-border)' }} />;
                                })}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                    <button key={n} type="button" onClick={() => {
                                        if (view === 'setup-mpin') mpin.length < 4 && setMpin(prev => prev + n);
                                        else confirmMpin.length < 4 && setConfirmMpin(prev => prev + n);
                                    }} style={{ background: 'rgba(255,255,255,0.03)', fontSize: '1.5rem', padding: '15px', borderRadius: '12px' }}>{n}</button>
                                ))}
                                <button type="button" onClick={() => view === 'setup-mpin' ? setMpin(prev => prev.slice(0, -1)) : setConfirmMpin(prev => prev.slice(0, -1))} style={{ background: 'rgba(255,255,255,0.03)', fontSize: '1.5rem', color: 'var(--danger)', borderRadius: '12px' }}>←</button>
                                <button type="button" onClick={() => {
                                    if (view === 'setup-mpin') mpin.length < 4 && setMpin(prev => prev + '0');
                                    else confirmMpin.length < 4 && setConfirmMpin(prev => prev + '0');
                                }} style={{ background: 'rgba(255,255,255,0.03)', fontSize: '1.5rem', borderRadius: '12px' }}>0</button>
                                <button type="submit" disabled={(view === 'setup-mpin' ? mpin.length : confirmMpin.length) !== 4} style={{ background: (view === 'setup-mpin' ? mpin.length : confirmMpin.length) === 4 ? 'var(--primary)' : 'rgba(188,19,254,0.1)', color: 'white', borderRadius: '12px' }}>{view === 'setup-mpin' ? 'NEXT' : 'FINISH'}</button>
                            </div>
                        </form>
                    )}
                </div>
                <div style={{ padding: '2rem 0', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <BrandFooter />
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <StatusStyles />
            {showWinOverlay && <WinBlastOverlay />}
            {showSentOverlay && <SentBlastOverlay />}
            <div style={{ flex: 1 }}>
                {renderContent()}
            </div>
        </div>
    );
};

export default App;
