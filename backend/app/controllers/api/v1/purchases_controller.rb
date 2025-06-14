class Api::V1::PurchasesController < ApplicationController
  before_action :set_purchase, only: [:show, :update, :destroy]

  # GET /api/v1/purchases
  def index
    @purchases = Purchase.all
    
    # フィルタリング
    if params[:year].present?
      if params[:month].present?
        @purchases = @purchases.by_month(params[:year].to_i, params[:month].to_i)
      else
        @purchases = @purchases.by_year(params[:year].to_i)
      end
    end
    
    @purchases = @purchases.by_category(params[:category]) if params[:category].present?
    @purchases = @purchases.order(date: :desc)
    
    render json: {
      purchases: @purchases,
      summary: calculate_summary(@purchases)
    }
  end

  # GET /api/v1/purchases/:id
  def show
    render json: @purchase
  end

  # POST /api/v1/purchases
  def create
    @purchase = Purchase.new(purchase_params)
    
    if @purchase.save
      render json: @purchase, status: :created
    else
      render json: { errors: @purchase.errors }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/purchases/:id
  def update
    if @purchase.update(purchase_params)
      render json: @purchase
    else
      render json: { errors: @purchase.errors }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/purchases/:id
  def destroy
    @purchase.destroy
    head :no_content
  end

  private

  def set_purchase
    @purchase = Purchase.find(params[:id])
  end

  def purchase_params
    params.require(:purchase).permit(:name, :amount, :category, :date, :description)
  end

  def calculate_summary(purchases)
    # GROUP BYの前にorder句を削除
    {
      total_amount: purchases.sum(:amount),
      item_count: purchases.count,
      category_breakdown: purchases.reorder('').group(:category).sum(:amount)
    }
  end
end
