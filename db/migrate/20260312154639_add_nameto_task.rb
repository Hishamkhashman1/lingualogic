class AddNametoTask < ActiveRecord::Migration[7.1]
  def change
    add_column :tasks, :name, :string
  end
end
