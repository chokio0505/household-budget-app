FROM node:22.16-alpine3.22

# 作業ディレクトリ設定
WORKDIR /app

# package.jsonをコピーして依存関係をインストール
COPY package*.json ./
RUN npm ci

# アプリケーションコードをコピー
COPY . .

# ポート公開
EXPOSE 3000

# 開発サーバー起動
CMD ["npm", "run", "dev"]