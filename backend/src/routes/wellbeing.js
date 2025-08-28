const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, (req, res, next) => {
  const userId = req.user.id;
  const {
    date,
    sleep_before_midnight,
    sleep_quality,
    morning_sun,
    active_exercise,
    conversation,
    alcohol,
    main_focus,
    mood
  } = req.body;

  const entryDate = date || new Date().toISOString().slice(0, 10);

  const stmt = `INSERT INTO wellbeing_records (user_id, date, sleep_before_midnight, sleep_quality, morning_sun, active_exercise, conversation, alcohol, main_focus, mood) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(
    stmt,
    [
      userId,
      entryDate,
      sleep_before_midnight,
      sleep_quality,
      morning_sun,
      active_exercise,
      conversation,
      alcohol,
      main_focus,
      mood,
    ],
    function (err) {
      if (err) {
        const dbErr = new Error('記録の保存中にエラーが発生しました。');
        dbErr.status = 500;
        return next(dbErr);
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

router.get('/', authMiddleware, (req, res, next) => {
  const userId = req.user.id;
  db.all(
    'SELECT * FROM wellbeing_records WHERE user_id = ? ORDER BY date DESC',
    [userId],
    (err, rows) => {
      if (err) {
        const dbErr = new Error('記録の取得中にエラーが発生しました。');
        dbErr.status = 500;
        return next(dbErr);
      }
      res.json({ records: rows });
    }
  );
});

module.exports = router;
