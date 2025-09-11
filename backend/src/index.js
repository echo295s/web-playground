require('dotenv').config();
const express = require('express');
const cors = require('cors');

const messageRoutes = require('./routes/messages');
const authRoutes = require('./routes/auth');
const wellbeingRoutes = require('./routes/wellbeing');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', messageRoutes);
app.use('/api/wellbeing', wellbeingRoutes);

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

if (require.main === module) {
  app.listen(port, () => {
    console.log(`サーバーが起動しました。: http://localhost:${port}`)
  });
}

module.exports = app;
