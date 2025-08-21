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
app.use('/api/auth', authRoutes);
app.use('/api', messageRoutes);

// 未定義ルートのハンドリング
app.use((req, res, next) => {
  res.status(404).json({ error: 'リソースが見つかりません。' });
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.status ? err.message : 'サーバー内部でエラーが発生しました。';
  res.status(status).json({ error: message });
});

app.listen(port, () => {
  console.log(`サーバーが起動しました。: http://localhost:${port}`)
});
