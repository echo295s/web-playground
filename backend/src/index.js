require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const messageRoutes = require('./routes/messages');
const authRoutes = require('./routes/auth');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', messageRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`サーバーが起動しました。: http://localhost:${port}`)
});
