const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../data.db')

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('データベース接続エラー:', err.message)
  } else {
    console.log('SQLite データベースに接続しました。:', dbPath)
  }
})

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('テーブル作成エラー:', err.message)
    } else {
      console.log('messages テーブルが準備できました。')
    }
  })

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('テーブル作成エラー:', err.message)
    } else {
      console.log('users テーブルが準備できました。')
    }
  })

  db.run(`
    CREATE TABLE IF NOT EXISTS wellbeing_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      sleep_before_midnight INTEGER,
      sleep_quality INTEGER,
      morning_sun INTEGER,
      active_exercise INTEGER,
      conversation INTEGER,
      alcohol INTEGER,
      main_focus TEXT,
      mood INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('テーブル作成エラー:', err.message)
    } else {
      console.log('wellbeing_records テーブルが準備できました。')
    }
  })
})

module.exports = db
