#!/bin/bash
set -e

echo "🚀 開発サーバー起動中..."
echo ""
echo "🌐 アクセスURL："
echo "  📱 フロントエンド: http://localhost:3001"
echo "  🔧 API: http://localhost:3000"
echo "  💾 PostgreSQL: localhost:5432"
echo ""
echo "💾 停止するには Ctrl+C を押してください"
echo ""

# Docker Composeで全サービス起動
docker compose up