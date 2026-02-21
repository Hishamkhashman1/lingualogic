class AddImageToMonsters < ActiveRecord::Migration[7.1]
  def change
    add_column :monsters, :image, :string
  end
end
