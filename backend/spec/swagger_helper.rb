# frozen_string_literal: true

require 'rails_helper'

RSpec.configure do |config|
  # Specify a root folder where Swagger JSON files are generated
  # NOTE: If you're using the rswag-api to serve API descriptions, you'll need
  # to ensure that it's configured to serve Swagger from the same folder
  config.openapi_root = Rails.root.join('swagger').to_s

  # Define one or more Swagger documents and provide global metadata for each one
  # When you run the 'rswag:specs:swaggerize' rake task, the complete Swagger will
  # be generated at the provided relative path under openapi_root
  # By default, the operations defined in spec files are added to the first
  # document below. You can override this behavior by adding a openapi_spec tag to the
  # the root example_group in your specs, e.g. describe '...', openapi_spec: 'v2/swagger.json'
  config.openapi_specs = {
    'v1/swagger.yaml' => {
      openapi: '3.0.1',
      info: {
        title: '家計簿アプリ API',
        version: 'v1',
        description: '家計簿管理アプリケーションのREST API',
        contact: {
          name: '家計簿アプリ開発チーム'
        }
      },
      paths: {},
      servers: [
        {
          url: 'http://localhost:3000',
          description: '開発環境'
        }
      ],
      components: {
        schemas: {
          Purchase: {
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
          },
          PurchaseRequest: {
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
          },
          Summary: {
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
          },
          Error: {
            type: :object,
            properties: {
              errors: {
                type: :object,
                additionalProperties: {
                  type: :array,
                  items: { type: :string }
                }
              }
            }
          }
        }
      }
    }
  }

  # Specify the format of the output Swagger file when running 'rswag:specs:swaggerize'.
  # The openapi_specs configuration option has the filename including format in
  # the key, this may want to be changed to avoid putting yaml in json files.
  # Defaults to json. Accepts ':json' and ':yaml'.
  config.openapi_format = :yaml
end
