const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/message', (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'リクエストにbodyが含まれていません。' });

  const insertMessage = db.prepare('INSERT INTO messages (content) VALUES (?)');
  insertMessage.run(content, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  })
  insertMessage.finalize();
});

router.get('/messages', (req, res) => {
  db.all('SELECT * FROM messages ORDER BY created_at ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ messages: rows });
  })
})

module.exports = router;
