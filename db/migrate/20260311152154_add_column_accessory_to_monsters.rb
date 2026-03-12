class AddColumnAccessoryToMonsters < ActiveRecord::Migration[7.1]
  def change
    add_column :monsters, :accessory, :string, default: "none"
  end
end
