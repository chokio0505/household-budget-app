FROM ruby:3.1-slim

# システム依存関係のインストール
RUN apt-get update -qq && \
    apt-get install -y \
    build-essential \
    libpq-dev \
    nodejs \
    npm \
    libyaml-dev \
    git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 作業ディレクトリ設定
WORKDIR /app

# Gemfileをコピーして依存関係をインストール
COPY Gemfile Gemfile.lock ./
RUN bundle install

# アプリケーションコードをコピー
COPY . .

# ポート公開
EXPOSE 3000

# デフォルトコマンド
CMD ["bin/rails", "server", "-b", "0.0.0.0"]