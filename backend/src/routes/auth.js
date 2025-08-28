const express = require('express');
const router = express.Router();
const db = require('../db');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'ユーザー名とパスワードは必須です' });
  }

  const usernameRegex = /^[A-Za-z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    return res
      .status(400)
      .json({ error: 'ユーザー名は3〜20文字の英数字またはアンダースコアで入力してください' });
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
  if (!passwordRegex.test(password)) {
    return res
      .status(400)
      .json({ error: 'パスワードは8〜20文字の英数字を含めて入力してください' });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: 'ハッシュ化エラー' });

    db.run(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, hash],
      function (err) {
        if (err) {
          if (err.message && err.message.includes('UNIQUE')) {
            return res.status(409).json({ error: 'ユーザー名は既に使用されています' });
          }
          return res.status(500).json({ error: 'DBエラー' });
        }

        res.status(201).json({ message: 'ユーザー登録が完了しました' });
      }
    );
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).json({ error: 'DBエラー' });
    if (!user) return res.status(401).json({ error: 'ユーザーが存在しません' });

    bcrypt.compare(password, user.password_hash, (err, result) => {
      if (err) return res.status(500).json({ error: '認証エラー' });
      if (!result) return res.status(401).json({ error: 'パスワードが違います' });

      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '5m'
      });
      res.json({ token });
    });
  });
});

module.exports = router;
