class AddDefaultHealthToMonsters < ActiveRecord::Migration[7.1]
  def change
    add_column :monsters, :health, :integer, default: 50
  end

  def down
    change_column_default :monsters, :health, nil
  end
end
