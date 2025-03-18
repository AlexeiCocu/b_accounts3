// eslint-disable-next-line @typescript-eslint/no-require-imports
const express = require('express');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cors = require('cors');

const app = express();
const port = 5001; // Backend server port

// Enable CORS for frontend-backend communication
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Mock data
const accounts = [
    { ownerId: 1, currency: 'USD', balance: 1000 },
    { ownerId: 2, currency: 'EUR', balance: 500 },
    { ownerId: 3, currency: 'EUR', balance: 750 },
];

// Endpoint to fetch accounts
app.get('/api/accounts', (req, res) => {
    res.json(accounts);
});

// Endpoint to create a new account
app.post('/api/accounts', (req, res) => {
    const { ownerId, currency, balance } = req.body;

    if (!ownerId || !currency || balance == null) {
        return res.status(400).json({ message: 'Invalid account data' });
    }

    // Check if ownerId already exists
    const isDuplicate = accounts.some(account => account.ownerId === ownerId);
    if (isDuplicate) {
        return res.status(400).json({ message: 'Owner ID must be unique.' });
    }

    const newAccount = { ownerId, currency, balance };
    accounts.push(newAccount);

    res.status(201).json(newAccount);
});

// Endpoint to update a new account
app.put('/api/accounts/:ownerId', (req, res) => {
    const ownerId = parseInt(req.params.ownerId, 10);
    const { currency, balance } = req.body;

    const account = accounts.find(acc => acc.ownerId === ownerId);
    if (account) {
        account.currency = currency;
        account.balance = balance;
        res.status(200).json(account);
    } else {
        res.status(404).json({ message: 'Account not found' });
    }
});


// Endpoint to transfer funds between accounts
app.post('/api/accounts/transfer', (req, res) => {
    const { fromOwnerId, toOwnerId, amount } = req.body;

    if (!fromOwnerId || !toOwnerId || amount == null || amount <= 0) {
        return res.status(400).json({ message: 'Invalid transfer data' });
    }

    const fromAccount = accounts.find(acc => acc.ownerId === fromOwnerId);
    const toAccount = accounts.find(acc => acc.ownerId === toOwnerId);

    if (!fromAccount || !toAccount) {
        return res.status(404).json({ message: 'One or both accounts not found' });
    }

    if (fromAccount.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
    }

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    res.status(200).json({ message: 'Transfer successful', fromAccount, toAccount });
});


// Endpoint to delete an account
app.delete('/api/accounts/:ownerId', (req, res) => {
    const ownerId = parseInt(req.params.ownerId, 10);
    const index = accounts.findIndex(acc => acc.ownerId === ownerId);
    if (index !== -1) {
        accounts.splice(index, 1);
        res.status(200).json({ message: 'Account deleted successfully' });
    } else {
        res.status(404).json({ message: 'Account not found' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Mock backend running at http://localhost:${port}`);
});
