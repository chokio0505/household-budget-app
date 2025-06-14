#!/bin/bash
set -e

echo "🐳 Docker環境セットアップ開始..."

# Docker Composeでビルド
echo "📦 Dockerイメージをビルド中..."
docker compose build

# データベース初期化
echo "🗄️ データベースを初期化中..."
docker compose run --rm backend bin/rails db:create db:migrate

echo "✅ セットアップ完了！"
echo ""
echo "🚀 以下のコマンドで開発開始："
echo "  ./scripts/dev.sh"
echo ""
echo "🌐 アクセスURL："
echo "  フロントエンド: http://localhost:3001"
echo "  API: http://localhost:3000"
echo "  PostgreSQL: localhost:5432"