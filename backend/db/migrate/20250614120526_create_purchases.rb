class CreatePurchases < ActiveRecord::Migration[7.2]
  def change
    create_table :purchases do |t|
      t.string :name
      t.decimal :amount
      t.string :category
      t.date :date
      t.text :description

      t.timestamps
    end
  end
end
