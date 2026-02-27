const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, enum: ['incoming', 'outgoing', 'investment'], required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'Completed' },
    note: { type: String }
});

const HoldingSchema = new mongoose.Schema({
    company: { type: String, required: true },
    symbol: { type: String, required: true },
    boughtPrice: { type: Number, required: true },
    shares: { type: Number, required: true },
    investedDate: { type: String },
    investedAmount: { type: Number, required: true }
});

const RewardSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String },
    label: { type: String },
    amount: { type: Number },
    date: { type: Date, default: Date.now },
    icon: { type: String }
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    mpin: { type: String },
    active: { type: Boolean, default: false },
    otp: { type: String },
    balance: { type: Number, default: 50000 },
    coins: { type: Number, default: 77777 },
    lastSpinTime: { type: Number, default: 0 },
    spinsInWindow: { type: Number, default: 0 },
    cashbackWon: { type: Number, default: 0 },
    redeemedAmount: { type: Number, default: 0 },
    loginTime: { type: Date },
    transactions: [TransactionSchema],
    rewardsHistory: [RewardSchema],
    coinHistory: [RewardSchema],
    availableRewards: [RewardSchema],
    holdings: [HoldingSchema],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
