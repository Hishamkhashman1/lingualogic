class AddColumnNametoItems < ActiveRecord::Migration[7.1]
  def change
    add_column :items, :name, :string
  end
end
