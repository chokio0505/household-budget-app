require 'rails_helper'

RSpec.describe 'Purchases API', type: :request do
  path '/api/v1/purchases' do
    get('購入一覧取得') do
      tags 'Purchases'
      description '購入履歴の一覧を取得します。年月やカテゴリーでフィルタリングが可能です。'
      produces 'application/json'
      
      parameter name: :year, in: :query, type: :integer, description: '年（例: 2024）'
      parameter name: :month, in: :query, type: :integer, description: '月（例: 6）'
      parameter name: :category, in: :query, type: :string, description: 'カテゴリー名'

      response(200, '成功') do
        schema type: :object,
               properties: {
                 purchases: {
                   type: :array,
                   items: {
                     type: :object,
                     properties: {
                       id: { type: :integer, example: 1 },
                       name: { type: :string, example: 'スーパーでの買い物' },
                       amount: { type: :number, format: :decimal, example: 2500.0 },
                       category: { type: :string, example: '食費' },
                       date: { type: :string, format: :date, example: '2024-06-14' },
                       description: { type: :string, example: '野菜と肉を購入', nullable: true },
                       created_at: { type: :string, format: :datetime },
                       updated_at: { type: :string, format: :datetime }
                     },
                     required: %w[id name amount category date created_at updated_at]
                   }
                 },
                 summary: {
                   type: :object,
                   properties: {
                     total_amount: { type: :number, format: :decimal, example: 15000.0 },
                     item_count: { type: :integer, example: 10 },
                     category_breakdown: {
                       type: :object,
                       additionalProperties: { type: :number, format: :decimal },
                       example: { '食費' => 8000.0, '交通費' => 4500.0, '書籍' => 2500.0 }
                     }
                   },
                   required: %w[total_amount item_count category_breakdown]
                 }
               },
               required: %w[purchases summary]

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data).to have_key('purchases')
          expect(data).to have_key('summary')
        end
      end
    end

    post('購入作成') do
      tags 'Purchases'
      description '新しい購入履歴を作成します。'
      consumes 'application/json'
      produces 'application/json'
      
      parameter name: :purchase, in: :body, schema: {
        type: :object,
        properties: {
          purchase: {
            type: :object,
            properties: {
              name: { type: :string, example: 'スーパーでの買い物' },
              amount: { type: :number, format: :decimal, example: 2500.0 },
              category: { type: :string, example: '食費' },
              date: { type: :string, format: :date, example: '2024-06-14' },
              description: { type: :string, example: '野菜と肉を購入', nullable: true }
            },
            required: %w[name amount category date]
          }
        },
        required: %w[purchase]
      }

      response(201, '作成成功') do
        schema type: :object,
               properties: {
                 id: { type: :integer, example: 1 },
                 name: { type: :string, example: 'スーパーでの買い物' },
                 amount: { type: :number, format: :decimal, example: 2500.0 },
                 category: { type: :string, example: '食費' },
                 date: { type: :string, format: :date, example: '2024-06-14' },
                 description: { type: :string, example: '野菜と肉を購入', nullable: true },
                 created_at: { type: :string, format: :datetime },
                 updated_at: { type: :string, format: :datetime }
               },
               required: %w[id name amount category date created_at updated_at]

        let(:purchase) do
          {
            purchase: {
              name: 'スーパーでの買い物',
              amount: 2500.0,
              category: '食費',
              date: '2024-06-14',
              description: '野菜と肉を購入'
            }
          }
        end

        run_test!
      end

      response(422, 'バリデーションエラー') do
        schema type: :object,
               properties: {
                 errors: {
                   type: :object,
                   additionalProperties: {
                     type: :array,
                     items: { type: :string }
                   },
                   example: {
                     name: ['can\'t be blank'],
                     amount: ['must be greater than 0']
                   }
                 }
               }

        let(:purchase) do
          {
            purchase: {
              name: '',
              amount: -100,
              category: '',
              date: ''
            }
          }
        end

        run_test!
      end
    end
  end

  path '/api/v1/purchases/{id}' do
    parameter name: 'id', in: :path, type: :integer, description: '購入ID'

    get('購入詳細取得') do
      tags 'Purchases'
      description '指定IDの購入履歴詳細を取得します。'
      produces 'application/json'

      response(200, '成功') do
        schema type: :object,
               properties: {
                 id: { type: :integer, example: 1 },
                 name: { type: :string, example: 'スーパーでの買い物' },
                 amount: { type: :number, format: :decimal, example: 2500.0 },
                 category: { type: :string, example: '食費' },
                 date: { type: :string, format: :date, example: '2024-06-14' },
                 description: { type: :string, example: '野菜と肉を購入', nullable: true },
                 created_at: { type: :string, format: :datetime },
                 updated_at: { type: :string, format: :datetime }
               },
               required: %w[id name amount category date created_at updated_at]

        let(:id) { Purchase.create!(name: 'テスト', amount: 1000, category: '食費', date: Date.current).id }
        run_test!
      end

      response(404, '見つからない') do
        let(:id) { 99999 }
        run_test!
      end
    end

    patch('購入更新') do
      tags 'Purchases'
      description '指定IDの購入履歴を更新します。'
      consumes 'application/json'
      produces 'application/json'
      
      parameter name: :purchase, in: :body, schema: {
        type: :object,
        properties: {
          purchase: {
            type: :object,
            properties: {
              name: { type: :string, example: 'スーパーでの買い物（更新）' },
              amount: { type: :number, format: :decimal, example: 3000.0 },
              category: { type: :string, example: '食費' },
              date: { type: :string, format: :date, example: '2024-06-14' },
              description: { type: :string, example: '野菜と肉を購入（更新）', nullable: true }
            }
          }
        },
        required: %w[purchase]
      }

      response(200, '更新成功') do
        schema type: :object,
               properties: {
                 id: { type: :integer, example: 1 },
                 name: { type: :string, example: 'スーパーでの買い物（更新）' },
                 amount: { type: :number, format: :decimal, example: 3000.0 },
                 category: { type: :string, example: '食費' },
                 date: { type: :string, format: :date, example: '2024-06-14' },
                 description: { type: :string, example: '野菜と肉を購入（更新）', nullable: true },
                 created_at: { type: :string, format: :datetime },
                 updated_at: { type: :string, format: :datetime }
               },
               required: %w[id name amount category date created_at updated_at]

        let(:id) { Purchase.create!(name: 'テスト', amount: 1000, category: '食費', date: Date.current).id }
        let(:purchase) do
          {
            purchase: {
              name: 'スーパーでの買い物（更新）',
              amount: 3000.0,
              category: '食費',
              date: '2024-06-14',
              description: '野菜と肉を購入（更新）'
            }
          }
        end

        run_test!
      end

      response(404, '見つからない') do
        let(:id) { 99999 }
        let(:purchase) { { purchase: { name: 'test' } } }
        run_test!
      end

      response(422, 'バリデーションエラー') do
        let(:id) { Purchase.create!(name: 'テスト', amount: 1000, category: '食費', date: Date.current).id }
        let(:purchase) do
          {
            purchase: {
              name: '',
              amount: -100
            }
          }
        end
        run_test!
      end
    end

    delete('購入削除') do
      tags 'Purchases'
      description '指定IDの購入履歴を削除します。'

      response(204, '削除成功') do
        let(:id) { Purchase.create!(name: 'テスト', amount: 1000, category: '食費', date: Date.current).id }
        run_test!
      end

      response(404, '見つからない') do
        let(:id) { 99999 }
        run_test!
      end
    end
  end
end
