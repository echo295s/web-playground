require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./utils/logger');

const messageRoutes = require('./routes/messages');
const authRoutes = require('./routes/auth');
const wellbeingRoutes = require('./routes/wellbeing');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: logger.stream }));
app.use('/api/auth', authRoutes);
app.use('/api', messageRoutes);
app.use('/api/wellbeing', wellbeingRoutes);

// 未定義ルートのハンドリング
app.use((req, res, next) => {
  res.status(404).json({ error: 'リソースが見つかりません。' });
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  logger.error(err);
  const status = err.status || 500;
  const message = err.status ? err.message : 'サーバー内部でエラーが発生しました。';
  res.status(status).json({ error: message });
});

if (require.main === module) {
  app.listen(port, () => {
    logger.info(`サーバーが起動しました。: http://localhost:${port}`);
  });
}

module.exports = app;
