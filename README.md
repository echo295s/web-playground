#### 開発ディレクトリ
`C:\dev\web-playground`

#### リポジトリ
`https://github.com/echo295s/web-playground.git`

#### 起動コマンド
`npm run start:all`

#### ポート
* Vue: [http://localhost:5173](http://localhost:5173)
* Express: [http://localhost:4000](http://localhost:4000)

#### 要件
ChatGPTとGitHubを連携する。

【フロントエンド】
- Vue.js
- Vuetify
- Axios

【バックエンド】
- Node.js
- Express.js

【認証・セキュリティ】
- bcrypt
- JSON Web Token

【データベース】
- SQLite

学習用のためセキュリティ上、本来は含めるべきでないファイル、情報が含まれている。

#### 環境変数
バックエンドでは JWT の検証に `JWT_SECRET` を使用します。`.env` などで以下のように設定してください。

```
JWT_SECRET=your_secret_key
```

#### テストアカウント
- testUser1:password
- testUser2:1234
