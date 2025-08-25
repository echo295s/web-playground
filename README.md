#### 開発ディレクトリ
`C:\dev\web-playground`

#### リポジトリ
`https://github.com/echo295s/web-playground.git`

#### セットアップ
1. 依存関係をインストールする。
   ```sh
   npm i
   cd backend && npm i && cd ..
   cd frontend && npm i && cd ..
   ```
2. 環境変数ファイルを作成する。
   ```sh
   cp backend/.env.example backend/.env
   ```
   `backend/.env` の `JWT_SECRET` を任意の値に書き換える。

#### 起動コマンド
`npm run start:all`

#### ポート
* Vue: [http://localhost:5173](http://localhost:5173)
* Express: [http://localhost:4000](http://localhost:4000)

#### 要件
ChatGPTとGitHubを連携する。

【フロントエンド】
- Vue.js
- Vuex
- Vue Router
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

`npm run start:all` で起動したあとプロセスが残ることがある。

プロセスが残るとAPIが更新されない。

#### テストアカウント
- testUser1:password
- testUser2:1234
