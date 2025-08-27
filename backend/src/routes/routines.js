const express = require('express');
const db = require('../db');

const router = express.Router();

router.post('/', (req, res, next) => {
  const {
    date,
    sleep_before_midnight,
    sleep_quality,
    sunlight_before_nine,
    active_exercise,
    conversation,
    alcohol,
    main_focus,
    mood
  } = req.body;

  const query = `INSERT OR REPLACE INTO routines (date, sleep_before_midnight, sleep_quality, sunlight_before_nine, active_exercise, conversation, alcohol, main_focus, mood) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [date, sleep_before_midnight, sleep_quality, sunlight_before_nine, active_exercise, conversation, alcohol, main_focus, mood];

  db.run(query, params, function(err) {
    if (err) {
      return next(err);
    }
    res.status(201).json({ id: this.lastID });
  });
});

router.get('/week', (req, res, next) => {
  const query = `SELECT * FROM routines WHERE date >= date('now','-6 day') ORDER BY date`;
  db.all(query, [], (err, rows) => {
    if (err) {
      return next(err);
    }
    res.json(rows);
  });
});

module.exports = router;
