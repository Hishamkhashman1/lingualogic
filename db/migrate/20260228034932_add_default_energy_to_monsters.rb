class AddDefaultEnergyToMonsters < ActiveRecord::Migration[7.1]
  def change
    change_column_default :monsters, :energy, 15
  end
end
