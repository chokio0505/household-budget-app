# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# 家計簿アプリのサンプルデータ
categories = ['食費', '交通費', '書籍', '家電', '衣類', '医療費', '娯楽', '光熱費', '通信費']

# 過去3ヶ月のサンプル購入データを作成
(0..2).each do |month_offset|
  base_date = Date.current - month_offset.months
  
  # 各月に15-25件のデータを作成
  items_count = rand(15..25)
  
  items_count.times do |i|
    category = categories.sample
    amount = case category
             when '食費'
               rand(200..8000)
             when '交通費'
               rand(150..5000)
             when '書籍'
               rand(500..3000)
             when '家電'
               rand(3000..150000)
             when '衣類'
               rand(1000..30000)
             when '医療費'
               rand(500..10000)
             when '娯楽'
               rand(500..15000)
             when '光熱費'
               rand(3000..12000)
             when '通信費'
               rand(2000..8000)
             else
               rand(100..10000)
             end
    
    # 月内のランダムな日付
    day = rand(1..28)
    purchase_date = Date.new(base_date.year, base_date.month, day)
    
    # 商品名の生成
    name = case category
           when '食費'
             ['スーパーでの買い物', 'コンビニ', 'レストラン', 'お弁当', 'おやつ'].sample
           when '交通費'
             ['電車代', 'バス代', 'タクシー', 'ガソリン代', '駐車場代'].sample
           when '書籍'
             ['技術書', '小説', '雑誌', '漫画', '参考書'].sample
           when '家電'
             ['冷蔵庫', '洗濯機', 'テレビ', 'エアコン', '掃除機'].sample
           when '衣類'
             ['シャツ', 'パンツ', '靴', 'コート', 'アクセサリー'].sample
           when '医療費'
             ['病院', '薬局', '健康診断', 'マッサージ', 'サプリメント'].sample
           when '娯楽'
             ['映画', 'コンサート', 'ゲーム', 'カラオケ', '旅行'].sample
           when '光熱費'
             ['電気代', 'ガス代', '水道代'].sample
           when '通信費'
             ['携帯電話', 'インターネット', 'プロバイダー'].sample
           else
             "#{category}での購入"
           end
    
    # 説明文（50%の確率で追加）
    description = if rand < 0.5
                    case category
                    when '食費'
                      '野菜と肉を購入'
                    when '交通費'
                      '往復料金'
                    when '書籍'
                      'プログラミング関連書籍'
                    when '家電'
                      '省エネモデルを選択'
                    when '衣類'
                      'セール品を購入'
                    when '医療費'
                      '定期検診'
                    when '娯楽'
                      '友人と一緒に'
                    when '光熱費'
                      '月額料金'
                    when '通信費'
                      '月額料金'
                    else
                      '詳細情報'
                    end
                  else
                    nil
                  end
    
    Purchase.find_or_create_by(
      name: name,
      amount: amount,
      category: category,
      date: purchase_date,
      description: description
    )
  end
end

puts "#{Purchase.count}件の購入データを作成しました。"
