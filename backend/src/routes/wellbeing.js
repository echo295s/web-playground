const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// Create or update wellbeing entry
router.post('/wellbeing', authMiddleware, (req, res, next) => {
  const {
    date,
    sleepBeforeMidnight,
    sleepQuality,
    morningSunlight,
    activeExercise,
    conversation,
    alcohol,
    mainFocus,
    mood,
  } = req.body;

  const entryDate = date || new Date().toISOString().split('T')[0];

  const stmt = db.prepare(
    `INSERT INTO wellbeing_entries (user_id, date, sleep_before_midnight, sleep_quality, morning_sunlight, active_exercise, conversation, alcohol, main_focus, mood)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  stmt.run(
    req.user.id,
    entryDate,
    sleepBeforeMidnight,
    sleepQuality,
    morningSunlight,
    activeExercise,
    conversation,
    alcohol,
    mainFocus,
    mood,
    function (err) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      res.json({ success: true, id: this.lastID });
    }
  );
  stmt.finalize();
});

// Get summary for last week and heatmap for all entries
router.get('/wellbeing/summary', authMiddleware, (req, res, next) => {
  const userId = req.user.id;
  const lastWeekQuery =
    "SELECT * FROM wellbeing_entries WHERE user_id = ? AND date >= date('now', '-6 day') ORDER BY date ASC";
  const allQuery =
    'SELECT * FROM wellbeing_entries WHERE user_id = ? ORDER BY date ASC';

  db.all(lastWeekQuery, [userId], (err, rows) => {
    if (err) {
      err.status = 500;
      return next(err);
    }

    const counts = {
      sleep_before_midnight: 0,
      sleep_quality: 0,
      morning_sunlight: 0,
      active_exercise: 0,
      conversation: 0,
      alcohol: 0,
      mood: 0,
    };

    rows.forEach((row) => {
      if (row.sleep_before_midnight > 0) counts.sleep_before_midnight++;
      if (row.sleep_quality > 0) counts.sleep_quality++;
      if (row.morning_sunlight > 0) counts.morning_sunlight++;
      if (row.active_exercise > 0) counts.active_exercise++;
      if (row.conversation > 0) counts.conversation++;
      if (row.alcohol === 0) counts.alcohol++;
      if (row.mood > 0) counts.mood++;
    });

    const days = 7;
    const ratios = {};
    Object.keys(counts).forEach((key) => {
      ratios[key] = counts[key] / days;
    });

    db.all(allQuery, [userId], (err2, allRows) => {
      if (err2) {
        err2.status = 500;
        return next(err2);
      }

      const heatmap = allRows.map((r) => ({
        date: r.date,
        score:
          r.sleep_before_midnight +
          r.sleep_quality +
          r.morning_sunlight +
          r.active_exercise +
          r.conversation +
          r.alcohol +
          r.mood,
      }));

      res.json({ entries: rows, ratios, heatmap });
    });
  });
});

module.exports = router;
