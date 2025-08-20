const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const sqlite3 = require('sqlite3').verbose()

const router = express.Router()
const SECRET_KEY = 'your-secret-key'
const db = new sqlite3.Database('./data.db')

router.post('/login', (req, res) => {
  const { username, password } = req.body

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).json({ error: 'DBエラー' })
    if (!user) return res.status(401).json({ error: 'ユーザーが存在しません' })

    bcrypt.compare(password, user.password_hash, (err, result) => {
      if (err) return res.status(500).json({ error: '認証エラー' })
      if (!result) return res.status(401).json({ error: 'パスワードが違います' })

      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' })
      res.json({ token })
    })
  })
})

module.exports = router
