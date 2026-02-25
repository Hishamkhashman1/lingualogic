class ChangeDefaultMoney < ActiveRecord::Migration[7.1]
  def change
    change_column_default :students, :money, 0
  end
end
