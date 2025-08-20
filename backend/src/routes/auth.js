const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../db')

const router = express.Router()
const SECRET_KEY = 'your-secret-key'

router.post('/register', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'ユーザー名とパスワードは必須です' })
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: 'ハッシュ化エラー' })

    db.run(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, hash],
      function (err) {
        if (err) {
          if (err.message && err.message.includes('UNIQUE')) {
            return res.status(409).json({ error: 'ユーザー名は既に使用されています' })
          }
          return res.status(500).json({ error: 'DBエラー' })
        }

        res.status(201).json({ message: 'ユーザー登録が完了しました' })
      }
    )
  })
})

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
