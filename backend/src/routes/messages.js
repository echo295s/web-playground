const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

router.post('/message', authMiddleware, (req, res, next) => {
  const { content } = req.body;
  if (!content) {
    const err = new Error('メッセージ内容は必須です。');
    err.status = 400;
    return next(err);
  }

  const insertMessage = db.prepare('INSERT INTO messages (content) VALUES (?)');
  insertMessage.run(content, function (err) {
    if (err) {
      const dbErr = new Error('メッセージの保存中にエラーが発生しました。');
      dbErr.status = 500;
      return next(dbErr);
    }
    res.json({ success: true, id: this.lastID });
  });
  insertMessage.finalize();
});

router.get('/messages', authMiddleware, (req, res, next) => {
  db.all('SELECT * FROM messages ORDER BY created_at ASC', [], (err, rows) => {
    if (err) {
      const dbErr = new Error('メッセージの取得中にエラーが発生しました。');
      dbErr.status = 500;
      return next(dbErr);
    }
    res.json({ messages: rows });
  });
});

module.exports = router;
