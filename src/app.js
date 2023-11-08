const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');
const cardRoutes = require('./routes/fundAccountRoutes');
const transferRoutes = require('./routes/transferRoutes');
const  withdrawRoutes = require('./routes/withdrawRoutes');

app.use(express.json())
app.use(cors());

app.get('*', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: 'welcome to wallet-lite'
    })
})


app.use('/api/v1/', userRoutes);
app.use('/api/v1/', cardRoutes);
app.use('/api/v1/', transferRoutes);
app.use('/api/v1/', withdrawRoutes );


module.exports = app;
