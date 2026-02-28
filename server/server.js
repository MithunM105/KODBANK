const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// --- 🚨 SECURITY WIPE: Purge all users for clean redeploy ---
async function purgeDatabase() {
    try {
        await User.deleteMany({});
        console.log("🧹 DATABASE PURGED: All legacy identities wiped for fresh broadcast.");
    } catch (err) {
        console.error("Purge Error:", err);
    }
}

// Setup Email Engine
let transporter;
async function initEmail() {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
            // Priority Official Google Service Protocol for Cloud Reliability
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                },
                // High-latency cloud handshake adjustments
                connectionTimeout: 30000, 
                greetingTimeout: 30000,
                socketTimeout: 30000
            });
            await transporter.verify();
            console.log(`✅ EMAIL SERVICE: Priority Sync Active [${process.env.SMTP_USER}]`);
        } catch (error) {
            console.error("❌ EMAIL SERVICE ERROR:", error.message);
        }
    } else {
        console.log(`🛠️ EMAIL SERVICE: Skipping initialization (Missing credentials).`);
    }
}

// Database Connection & Fresh Start
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kodbank';
mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
})
.then(async () => {
    console.log('✅ DATABASE CONNECTED: High-Fidelity Sync Active');
    await purgeDatabase();
    await initEmail();
})
.catch(err => {
    console.error('❌ DATABASE CONNECTION ERROR:', err.message);
});


async function sendOTPEmail(email, otp) {
    if (!transporter) return;

    try {
        await transporter.sendMail({
            from: `"KODBANK SECURITY" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Verification Code: ${otp}`,
            html: `
                <div style="background: #020205; color: white; padding: 40px; font-family: sans-serif; border: 1px solid #bc13fe; border-radius: 20px; max-width: 500px; margin: auto;">
                    <h1 style="color: #bc13fe; text-align: center;">KODBANK CORE</h1>
                    <div style="height: 1px; background: rgba(188,19,254,0.2); margin: 20px 0;"></div>
                    <p style="font-size: 1.1rem; line-height: 1.6;">A request was made to initialize a new KODBANK terminal. Use the encrypted protocol code below to verify your identity:</p>
                    <div style="font-size: 3rem; font-weight: 900; letter-spacing: 12px; color: #ff007f; margin: 40px 0; text-align: center; background: rgba(255,0,127,0.05); padding: 20px; border-radius: 12px; border: 1px dashed #ff007f;">${otp}</div>
                    <p style="color: #d1d1f0; font-size: 0.9rem; text-align: center;">If you didn't request this, please ignore this transmission. Your account remains secure.</p>
                </div>
            `
        });
        console.log(`Email dispatched successfully to ${email}`);
    } catch (err) {
        console.error("Failed to send email to", email, ":", err.message);
    }
}

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true
}));

// Serve static assets from the frontend/dist folder
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// --- DYNAMIC MARKET ENGINE ---
let globalStockPrices = {
    'AAPL': 184.40, 'GOOGL': 3450.10, 'TSLA': 650.20, 'MSFT': 412.50, 'NVDA': 785.20,
    'AMZN': 175.40, 'META': 485.10, 'NFLX': 605.30, 'INTC': 42.10, 'BA': 185.50,
    'AMD': 178.20, 'AVGO': 1320.40
};

const stockColors = {
    'AAPL': '#555', 'GOOGL': '#4285F4', 'TSLA': '#E81123', 'MSFT': '#00A4EF', 'NVDA': '#76B900',
    'AMZN': '#FF9900', 'META': '#0668E1', 'NFLX': '#E50914', 'INTC': '#0071C5', 'BA': '#0033A1',
    'AMD': '#ED1C24', 'AVGO': '#E42831'
};

const marketEvents = [];

// Market Pulse: Fluctuate prices every 5 seconds
setInterval(() => {
    Object.keys(globalStockPrices).forEach(symbol => {
        const current = globalStockPrices[symbol];
        const volatility = 0.002;
        const drift = 0.0001;
        const change = current * (drift + (Math.random() - 0.5) * volatility);

        if (Math.random() > 0.995) {
            const surge = Math.random() > 0.5;
            const eventMagnitude = 0.02 + (Math.random() * 0.03); 
            const eventChange = surge ? current * eventMagnitude : -current * eventMagnitude;
            globalStockPrices[symbol] = parseFloat((current + change + eventChange).toFixed(2));

            marketEvents.push({
                id: 'ME' + Date.now(),
                symbol,
                type: surge ? 'surge' : 'dip',
                magnitude: (eventMagnitude * 100).toFixed(1),
                time: new Date().toISOString()
            });
        } else {
            globalStockPrices[symbol] = parseFloat((current + change).toFixed(2));
        }
    });
}, 5000);

// MongoDB Connection Status Check Middleware
const dbCheck = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ 
            message: 'DATABASE OFFLINE: Terminal cannot reach the Cloud Vault.',
            diagnostic: 'Ensure MONGODB_URI environment variable is correctly set in Render.'
        });
    }
    next();
};

app.use('/api', dbCheck);

// Helper for GPay-style Reward Generation
// Helper for Unified Coin/Cash Reward Generation (Spin Wheel)
const getSpinResult = () => {
    const results = [
        { type: 'cash', label: 'Upto $50', value: Math.floor(Math.random() * 50) + 1 },
        { type: 'cash', label: 'Flat $33', value: 33 },
        { type: 'coins', label: 'Upto 5k Coins', value: Math.floor(Math.random() * (5000 - 3500 + 1)) + 3500 },
        { type: 'coins', label: 'Flat 15k Coins', value: 15000 },
        { type: 'coins', label: 'Flat 3k Coins', value: 3000 },
        { type: 'loss', label: 'Better Luck', value: 0 }
    ];
    // Equal distribution (1/6 each)
    const index = Math.floor(Math.random() * results.length);
    return { ...results[index], index };
};

const generateReward = () => {
    const r = [
        { id: 'R'+Date.now(), type: 'cash', label: 'Cashback Win', amount: Math.floor(Math.random()*20)+1, icon: '💰' },
        { id: 'R'+Date.now(), type: 'coins', label: 'Coin Bonus', amount: Math.floor(Math.random()*500)+100, icon: '🪙' }
    ];
    return r[Math.floor(Math.random()*r.length)];
};

// Auth Logic
app.post('/api/register', async (req, res) => {
    const { username, email, password, phone } = req.body;
    try {
        if (await User.findOne({ username })) return res.status(400).json({ message: 'Username identifier already in use' });
        if (await User.findOne({ email })) return res.status(400).json({ message: 'Email identifier already in use' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const newUser = new User({
            username, email, password, phone, otp,
            active: false, balance: 50000, coins: 77777,
            holdings: [
                { "company": "Apple Inc.", "symbol": "AAPL", "boughtPrice": 150.20, "shares": 50, "investedDate": "2023-11-12", "investedAmount": 7510 },
                { "company": "Google", "symbol": "GOOGL", "boughtPrice": 2800.50, "shares": 2, "investedDate": "2024-01-05", "investedAmount": 5601 },
                { "company": "Tesla", "symbol": "TSLA", "boughtPrice": 800.00, "shares": 10, "investedDate": "2023-12-20", "investedAmount": 8000 },
                { "company": "Microsoft", "symbol": "MSFT", "boughtPrice": 300.00, "shares": 25, "investedDate": "2023-10-15", "investedAmount": 7500 },
                { "company": "NVIDIA", "symbol": "NVDA", "boughtPrice": 400.00, "shares": 15, "investedDate": "2024-01-10", "investedAmount": 6000 },
                { "company": "Amazon", "symbol": "AMZN", "boughtPrice": 140.00, "shares": 40, "investedDate": "2023-09-05", "investedAmount": 5600 },
                { "company": "Meta", "symbol": "META", "boughtPrice": 350.00, "shares": 12, "investedDate": "2023-08-20", "investedAmount": 4200 },
                { "company": "Netflix", "symbol": "NFLX", "boughtPrice": 500.00, "shares": 8, "investedDate": "2023-07-15", "investedAmount": 4000 },
                { "company": "Intel", "symbol": "INTC", "boughtPrice": 55.00, "shares": 100, "investedDate": "2023-06-10", "investedAmount": 5500 },
                { "company": "AMD", "symbol": "AMD", "boughtPrice": 120.00, "shares": 50, "investedDate": "2023-04-20", "investedAmount": 6000 }
            ]
        });
        await newUser.save();
        sendOTPEmail(email, otp);
        res.json({ message: 'Registration protocol initiated. Check encrypted channel for code.', email });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: 'Register Protocol Malfunction' });
    }
});

app.get('/api/check-username', async (req, res) => {
    const { username } = req.query;
    if (!username || username.length < 5) return res.json({ available: false, message: 'Too short' });
    try {
        const exists = await User.findOne({ username });
        res.json({ available: !exists });
    } catch (err) {
        res.status(500).json({ message: 'Error checking identity' });
    }
});

app.post('/api/resend-otp', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Identity not identified' });

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = newOtp;
        await user.save();
        sendOTPEmail(email, newOtp);
        res.json({ message: 'New encrypted protocol code dispatched.' });
    } catch (err) {
        res.status(500).json({ message: 'Resend sequence failed' });
    }
});

app.post('/api/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email, otp });
        if (!user) return res.status(400).json({ message: 'Invalid protocol verification key' });

        user.active = true;
        await user.save();
        res.json({ message: 'Identity verified. Set secondary mPIN protocol.', email: user.email });
    } catch (err) {
        res.status(500).json({ message: 'Verification sequence broken' });
    }
});

app.post('/api/setup-mpin', async (req, res) => {
    const { email, mpin } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Identity not found' });

        user.mpin = mpin;
        await user.save();
        res.json({ message: 'mPIN protocol established. Identity ready for sync.' });
    } catch (err) {
        res.status(500).json({ message: 'mPIN establishment error' });
    }
});

app.post('/api/verify-mpin', async (req, res) => {
    const { dq } = req.cookies;
    const { mpin } = req.body;
    if (!dq) return res.status(401).json({ message: 'Unauthorized access attempt' });

    try {
        const user = await User.findById(dq);
        if (!user) return res.status(401).json({ message: 'Invalid identity sync' });

        if (user.mpin === mpin) {
            res.json({ success: true, message: 'mPIN Protocol Verified' });
        } else {
            res.status(401).json({ success: false, message: 'Incorrect security key' });
        }
    } catch (err) {
        console.error("mPIN Verify Error:", err);
        res.status(500).json({ message: 'Security verification failure' });
    }
});

app.post('/api/login', async (req, res) => {
    const { identifier, password } = req.body;
    try {
        const user = await User.findOne({ 
            $or: [{ username: identifier }, { email: identifier }], 
            password: password 
        });

        if (!user) {
            const userExists = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
            return res.status(401).json({ message: userExists ? 'Incorrect Security Key' : 'Identity does not exist' });
        }

        if (!user.active) {
            return res.status(403).json({ message: 'Account not activated. Protocol verification required.' });
        }

        user.loginTime = new Date();
        await user.save();

        res.cookie('dq', user.id, { httpOnly: true, secure: false });
        res.cookie('e', (Date.now() + 3600000).toString(), { httpOnly: false });
        res.cookie('o', uuidv4(), { httpOnly: false });

        res.json({ message: 'Login successful', username: user.username });
    } catch (err) {
        console.error("Login Sync Error:", err);
        res.status(500).json({ message: 'Sync Malfunction' });
    }
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('dq');
    res.clearCookie('e');
    res.clearCookie('o');
    res.json({ message: 'Logged out. Sync terminated.' });
});

app.get('/api/users/list', async (req, res) => {
    const { dq } = req.cookies;
    if (!dq) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const users = await User.find({ _id: { $ne: dq } }, 'username phone').limit(50);
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'User Discovery Error' });
    }
});

app.get('/api/users/search', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.json([]);
    try {
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } }
            ]
        }, 'username phone').limit(10);
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Search Protocol Malfunction' });
    }
});

app.get('/api/dashboard', async (req, res) => {
    const { dq } = req.cookies;
    if (!dq) return res.status(401).json({ message: 'Unauthorized terminal access' });

    try {
        const user = await User.findById(dq);
        if (!user) return res.status(401).json({ message: 'Invalid identity sync' });

        // --- Spin Limits Logic (5 per 24 Hours) ---
        const now = Date.now();
        const DAY_MS = 24 * 60 * 60 * 1000;
        
        if (now - (user.lastSpinTime || 0) > DAY_MS) {
            user.spinsInWindow = 0;
            // Note: we'll update lastSpinTime on actual spin if we want a sliding window, 
            // but the current logic seems to imply a reset if it hasn't spun in 24h.
            // Let's refine: reset spinsInWindow if the window has passed.
        }

        // --- Reward Replenishment Logic (3 Minute Cycle) ---
        const nowTs = Date.now();
        const lastReplen = user.loginTime ? new Date(user.loginTime).getTime() : 0; 
        // Using loginTime as a proxy or adding lastReplenishment field to schema
        // Let's assume schema has lastReplenishment or we use timestamps.
        
        // Check if we should replenish
        if (!user.lastReplenishment || nowTs - user.lastReplenishment > 180000) {
            let countToAdd = 0;
            const rand = Math.random();
            if (rand < 0.20) countToAdd = 3;
            else if (rand < 0.50) countToAdd = 2;
            else if (rand < 0.80) countToAdd = 1;

            if (countToAdd > 0) {
                const newRewards = Array.from({ length: countToAdd }, () => generateReward());
                user.availableRewards = [...(user.availableRewards || []), ...newRewards].slice(-3); 
            }
            user.lastReplenishment = nowTs;
            await user.save();
        }

        const hourBucket = Math.floor(Date.now() / 3600000);
        const threeHourBucket = Math.floor(Date.now() / (3600000 * 3));

        const incFluc = (Math.sin(hourBucket) * 500);
        const outFluc = (Math.cos(hourBucket) * 300);
        const invFluc = (Math.sin(threeHourBucket) * 1000);

        const baseBalance = user.balance;
        const transactions = user.transactions || [];

        const hourlyData = Array.from({ length: 24 }, (_, i) => ({
            time: `${(i + 13) % 24}:00`,
            value: baseBalance - 2000 + (Math.sin(i) * 500) + (i * 20)
        }));

        const weeklyData = Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString(undefined, { weekday: 'short' }),
            value: baseBalance - 5000 + (i * 800) + (Math.random() * 500)
        }));

        const stockPrices = globalStockPrices;
        const holdings = (user.holdings || []).map(h => ({
            ...h.toObject(),
            currentPrice: stockPrices[h.symbol] || h.boughtPrice * 1.1,
            color: stockColors[h.symbol] || '#bc13fe',
            history: generateClassicMarketTrend(h.boughtPrice, 1825),
            hourly: generateHourlyData(stockPrices[h.symbol] || h.boughtPrice * 1.1)
        }));

        res.json({
            username: user.username,
            loginTime: user.loginTime,
            accountNumber: '**** **** 1234',
            ifsc: 'KODB000789',
            balance: baseBalance,
            transactions: transactions,
            mpinSet: !!user.mpin,
            rewards: {
                won: user.cashbackWon || 0,
                redeemed: user.redeemedAmount || 0,
                coins: user.coins || 0,
                spinsLeft: 5 - (user.spinsInWindow || 0),
                history: user.rewardsHistory || [],
                coinHistory: user.coinHistory || []
            },
            trends: {
                incoming: 12500 + incFluc,
                outgoing: 8400 + outFluc,
                investment: 15000 + invFluc,
                hourly: hourlyData,
                weekly: weeklyData,
                chartData: Array.from({ length: 1460 }, (_, i) => ({
                    date: new Date(Date.now() - (1459 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    value: 30000 + (Math.random() * 20000) + (i * 15)
                }))
            },
            investments: {
                totalInvested: holdings.reduce((sum, h) => sum + h.investedAmount, 0),
                currentValue: holdings.reduce((sum, h) => sum + (h.currentPrice * h.shares), 0),
                increasePercentage: 29.8,
                holdings: holdings,
                trend: generateClassicMarketTrend(25000, 1825)
            },
            loans: {
                creditScore: 785,
                scoreTrend: Array.from({ length: 12 }, (_, i) => ({
                    month: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' }),
                    score: 720 + (i * 5) + Math.floor(Math.random() * 10)
                })),
                availableLoans: [
                    { id: 'L1', title: 'Personal Luxury Loan', provider: 'Global Prime', maxAmount: 50000, interest: '8.5%', type: 'unsecured' },
                    { id: 'L2', title: 'Home Protocol Loan', provider: 'Estate Core', maxAmount: 500000, interest: '6.2%', type: 'mortgage' },
                    { id: 'L3', title: 'Venture Capital Line', provider: 'Innovation Fund', maxAmount: 100000, interest: '12%', type: 'business' }
                ]
            },
            notifications: [
                ...marketEvents.slice(-2).map(ev => ({
                    id: ev.id,
                    type: 'investment',
                    message: `${ev.symbol} ${ev.type === 'surge' ? 'surged' : 'dropped'} by ${ev.magnitude}%! Trade now.`,
                    tab: 'investment',
                    icon: ev.type === 'surge' ? '🚀' : '📉'
                })),
                { id: 'N4', type: 'transaction', message: 'Salary of $5000 credited to account.', tab: 'history', icon: '💸' },
                { id: 'N5', type: 'transaction', message: 'Withdrawal of $80 at Walmart detected.', tab: 'history', icon: '🛒' }
            ]
        });
    } catch (err) {
        console.error("Dashboard Sync Error:", err);
        res.status(500).json({ message: 'Dashboard Sync Protocol Failed' });
    }
});

// Helper for High Fidelity Trendline (Random Walk with Drift)
function generateClassicMarketTrend(base, points) {
    let current = base;
    const history = [];
    const drift = 0.0005; 
    const volatility = 0.012; 

    for (let i = 0; i < points; i++) {
        const change = current * (drift + (Math.random() - 0.5) * volatility);
        const eventChance = Math.random();
        let eventChange = 0;
        if (eventChance > 0.99) {
            eventChange = current * (0.05 + Math.random() * 0.05);
        } else if (eventChance < 0.005) {
            eventChange = -current * (0.04 + Math.random() * 0.04);
        }

        current += change + eventChange;
        const date = new Date(Date.now() - (points - i) * 86400000);
        history.push({
            date: date.toISOString().split('T')[0],
            value: parseFloat(current.toFixed(2))
        });
    }
    return history;
}

// Add hourly data generator
function generateHourlyData(baseValue) {
    let current = baseValue;
    const history = [];
    for (let i = 0; i < 24; i++) {
        current += (Math.random() - 0.48) * (current * 0.005); // slight bias
        history.push({
            time: `${(i + 13) % 24}:00`,
            value: parseFloat(current.toFixed(2))
        });
    }
    return history;
}




app.post('/api/reward/spin', async (req, res) => {
    const { dq } = req.cookies;
    if (!dq) return res.status(401).json({ message: 'Unauthorized access' });

    try {
        const user = await User.findById(dq);
        if (!user) return res.status(401).json({ message: 'Identity missing' });
        
        const now = Date.now();
        const DAY_MS = 24 * 60 * 60 * 1000;
        if (now - (user.windowStartTime || 0) > DAY_MS) {
            user.windowStartTime = now;
            user.spinsInWindow = 0;
        }

        if ((user.spinsInWindow || 0) >= 5) {
            return res.status(400).json({ success: false, message: 'SPIN LIMIT REACHED (5/DAY). TRY TOMORROW.' });
        }

        if ((user.coins || 0) < 3000) {
            return res.status(400).json({ success: false, message: 'INSUFFICIENT COINS. NEED 3000.' });
        }

        user.coins -= 3000;
        user.spinsInWindow = (user.spinsInWindow || 0) + 1;
        user.lastSpinTime = now;
        
        const result = getSpinResult();
        const rewardId = 'R' + Date.now();

        if (result.type === 'cash') {
            user.cashbackWon = parseFloat(((user.cashbackWon || 0) + result.value).toFixed(2));
            user.rewardsHistory = [{ id: rewardId, type: 'Cash', label: result.label, amount: result.value, date: new Date(), status: 'Won' }, ...(user.rewardsHistory || [])];
            if (result.value > 0) {
                user.transactions = [{
                    id: 'T' + Date.now(),
                    type: 'incoming',
                    category: 'Spin Reward',
                    amount: result.value,
                    date: new Date(),
                    status: 'Completed',
                    note: `Spin Result: ${result.label}`
                }, ...(user.transactions || [])];
            }
        } else if (result.type === 'coins') {
            user.coins += result.value;
            user.coinHistory = [{ id: rewardId, type: 'Bonus', label: result.label, amount: result.value, date: new Date() }, ...(user.coinHistory || [])];
        } else {
            user.coinHistory = [{ id: rewardId, type: 'Loss', label: 'Better Luck', amount: 0, date: new Date() }, ...(user.coinHistory || [])];
        }

        await user.save();
        res.json({ success: true, result, coins: user.coins, cashbackWon: user.cashbackWon, spinsLeft: 5 - user.spinsInWindow });
    } catch (err) {
        res.status(500).json({ message: 'Spin Execution Error' });
    }
});

app.post('/api/reward/redeem', async (req, res) => {
    const { dq } = req.cookies;
    const { amount } = req.body;
    if (!dq) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const user = await User.findById(dq);
        if (!user || user.cashbackWon < amount) return res.status(400).json({ message: 'Insufficient rewards protocol' });

        user.balance += amount;
        user.redeemedAmount = (user.redeemedAmount || 0) + amount;
        user.cashbackWon -= amount;

        user.transactions = [{
            id: 'T' + Date.now(),
            type: 'incoming',
            category: 'Rewards Redeemed',
            amount,
            date: new Date(),
            status: 'Completed',
            note: `GPay-style broadcast redemption`
        }, ...(user.transactions || [])];

        await user.save();
        res.json({ success: true, balance: user.balance, cashbackWon: user.cashbackWon, redeemedAmount: user.redeemedAmount });
    } catch (err) {
        res.status(500).json({ message: 'Redemption Failure' });
    }
});


// --- NEW: Fund Transfer Protocols ---
app.get('/api/users/list', (req, res) => {
    const { dq } = req.cookies;
    if (!dq) return res.status(401).json({ message: 'Unauthorized' });

    const db = getDB();
    const session = db.sessions.find(s => s.dq === dq);
    if (!session) return res.status(401).json({ message: 'Invalid session' });

    // Return all other active users for the contact list
    const users = db.users
        .filter(u => u.username !== session.username && u.active)
        .map(u => ({ username: u.username, email: u.email }))
        .slice(0, 10);
    res.json(users);
});

app.get('/api/users/search', (req, res) => {
    const { query } = req.query;
    if (!query || query.length < 3) return res.json([]);

    const db = getDB();
    // Return limited info for privacy
    const matches = db.users
        .filter(u => (u.username.includes(query) || u.email.includes(query)) && u.active)
        .map(u => ({ username: u.username, email: u.email }))
        .slice(0, 5);
    res.json(matches);
});

// --- NEW: Fund Transfer Protocols ---
app.post('/api/transfer', async (req, res) => {
    const { dq } = req.cookies;
    const { recipient, amount, note } = req.body;
    if (!dq) return res.status(401).json({ message: 'Unauthorized sync attempt' });

    try {
        const sender = await User.findById(dq);
        const receiver = await User.findOne({ $or: [{ username: recipient }, { email: recipient }] });

        if (!receiver) return res.status(404).json({ message: 'Recipient protocol not identified' });
        if (sender.username === receiver.username) return res.status(400).json({ message: 'Self-transfer anomaly detected' });
        
        const transferAmount = parseFloat(amount);
        if (sender.balance < transferAmount) return res.status(400).json({ message: 'Insufficient terminal liquidity' });
        if (isNaN(transferAmount) || transferAmount <= 0) return res.status(400).json({ message: 'Invalid transmission amount' });

        const transactionId = 'TX' + Date.now();

        // Sender update
        sender.balance -= transferAmount;
        sender.transactions.unshift({
            id: transactionId, type: 'outgoing', category: 'Fund Transfer',
            amount: transferAmount, date: new Date(), status: 'Completed',
            note: `Sent to ${receiver.username}: ${note || 'No note'}`
        });

        // Receiver update
        receiver.balance += transferAmount;
        receiver.transactions.unshift({
            id: transactionId, type: 'incoming', category: 'Fund Transfer',
            amount: transferAmount, date: new Date(), status: 'Completed',
            note: `Received from ${sender.username}: ${note || 'No note'}`
        });

        await sender.save();
        await receiver.save();
        res.json({ success: true, balance: sender.balance, transactionId });
    } catch (err) {
        res.status(500).json({ message: 'Transfer protocol failed' });
    }
});

app.post('/api/loans/apply', async (req, res) => {
    const { dq } = req.cookies;
    const { loanId, amount } = req.body;
    if (!dq) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const user = await User.findById(dq);
        if (!user) return res.status(401).json({ message: 'Identity missing' });

        user.balance += amount;
        user.transactions.unshift({
            id: 'L-' + Date.now(), type: 'incoming', category: 'Loan Disbursement',
            amount, date: new Date(), status: 'Completed',
            note: `Loan Protocol ${loanId} successfully disbursed`
        });

        await user.save();
        res.json({ success: true, balance: user.balance });
    } catch (err) {
        res.status(500).json({ message: 'Loan Protocol Anomaly' });
    }
});

app.post('/api/invest/buy', async (req, res) => {
    const { dq } = req.cookies;
    const { symbol, shares } = req.body;
    if (!dq) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const user = await User.findById(dq);
        if (!user) return res.status(401).json({ message: 'Identity missing' });

        const price = globalStockPrices[symbol] || 100;
        const cost = shares * price;

        if (user.balance < cost) return res.status(400).json({ message: 'Insufficient liquidity in core balance' });

        user.balance -= cost;

        if (!user.holdings) user.holdings = [];
        const stock = user.holdings.find(h => h.symbol === symbol);
        if (stock) {
            const totalCost = (stock.boughtPrice * stock.shares) + cost;
            stock.shares += shares;
            stock.boughtPrice = totalCost / stock.shares;
            stock.investedAmount += cost;
        } else {
            const companies = { 'AAPL': 'Apple Inc.', 'GOOGL': 'Google', 'TSLA': 'Tesla', 'MSFT': 'Microsoft', 'NVDA': 'NVIDIA', 'AMZN': 'Amazon', 'META': 'Meta', 'NFLX': 'Netflix', 'INTC': 'Intel', 'BA': 'Boeing', 'AMD': 'AMD', 'AVGO': 'Broadcom' };
            user.holdings.push({
                company: companies[symbol] || symbol,
                symbol,
                boughtPrice: price,
                shares,
                investedDate: new Date().toISOString().split('T')[0],
                investedAmount: cost
            });
        }

        user.transactions.unshift({
            id: 'INV-' + Date.now(), type: 'outgoing', category: 'Asset Purchase',
            amount: cost, date: new Date(), status: 'Completed',
            note: `Purchased ${shares} units of ${symbol} at $${price}`
        });

        await user.save();
        res.json({ success: true, balance: user.balance });
    } catch (err) {
        res.status(500).json({ message: 'Investment Purchase Protocol Failed' });
    }
});

app.post('/api/invest/sell', async (req, res) => {
    const { dq } = req.cookies;
    const { symbol, shares } = req.body;
    if (!dq) return res.status(401).json({ message: 'Unauthorized access' });

    try {
        const user = await User.findById(dq);
        if (!user) return res.status(401).json({ message: 'Identity sync missing' });

        const price = globalStockPrices[symbol] || 100;
        const stock = user.holdings?.find(h => h.symbol === symbol);

        if (!stock || stock.shares < shares) return res.status(400).json({ message: 'Insufficient asset units' });

        const credit = shares * price;
        user.balance += credit;
        stock.shares -= shares;
        stock.investedAmount -= (stock.boughtPrice * shares);

        if (stock.shares === 0) {
            user.holdings = user.holdings.filter(h => h.symbol !== symbol);
        }

        user.transactions.unshift({
            id: 'INV-' + Date.now(), type: 'incoming', category: 'Asset Liquidation',
            amount: credit, date: new Date(), status: 'Completed',
            note: `Sold ${shares} units of ${symbol} at $${price}`
        });

        await user.save();
        res.json({ success: true, balance: user.balance });
    } catch (err) {
        res.status(500).json({ message: 'Asset Liquidation Protocol Failed' });
    }
});

// Catch-all route to serve the React app
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '../frontend/dist/index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(200).send(`
            <div style="background: #020205; color: white; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; border: 1px solid #bc13fe;">
                <h1 style="color: #ff007f;">KODBANK CORE ACTIVE</h1>
                <p>Visual Interface (Frontend) not detected. The API is operational.</p>
                <div style="padding: 10px; border: 1px dashed #bc13fe; border-radius: 8px; color: #00ffa3;">
                    STATUS: ${mongoose.connection.readyState === 1 ? 'VAULT SYNCED ✅' : 'VAULT OFFLINE ❌'}
                </div>
            </div>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`✅ SERVER ACTIVE: Listening on Port ${PORT}`);
});
