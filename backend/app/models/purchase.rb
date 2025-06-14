class Purchase < ApplicationRecord
  validates :name, presence: true, length: { maximum: 100 }
  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :category, presence: true
  validates :date, presence: true

  scope :by_month, ->(year, month) { where(date: Date.new(year, month).beginning_of_month..Date.new(year, month).end_of_month) }
  scope :by_year, ->(year) { where(date: Date.new(year).beginning_of_year..Date.new(year).end_of_year) }
  scope :by_category, ->(category) { where(category: category) }
end
