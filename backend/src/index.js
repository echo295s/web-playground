require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
let morgan;
try {
  morgan = require('morgan');
} catch (_) {
  morgan = () => (req, res, next) => next();
}

const logger = require('./utils/logger');
const messageRoutes = require('./routes/messages');
const authRoutes = require('./routes/auth');
const wellbeingRoutes = require('./routes/wellbeing');

const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const boardSize = 10;
let board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'init', board }));
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (
        data.type === 'update' &&
        Number.isInteger(data.x) &&
        Number.isInteger(data.y) &&
        data.x >= 0 &&
        data.x < boardSize &&
        data.y >= 0 &&
        data.y < boardSize
      ) {
        board[data.y][data.x] = data.value;
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: 'update',
                x: data.x,
                y: data.y,
                value: data.value,
              })
            );
          }
        });
      }
    } catch (err) {
      logger.warn('Invalid message', err);
    }
  });
});

app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: logger.stream }));
app.use('/api/auth', authRoutes);
app.use('/api', messageRoutes);
app.use('/api/wellbeing', wellbeingRoutes);

// 未定義ルートのハンドリング
app.use((req, res, next) => {
  logger.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
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
  server.listen(port, () => {
    logger.info(`サーバーが起動しました。: http://localhost:${port}`);
  });
}

module.exports = app;
