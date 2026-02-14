class CreateItems < ActiveRecord::Migration[7.1]
  def change
    create_table :items do |t|
      t.integer :price
      t.integer :effect
      t.string :description
      t.boolean :accessory

      t.timestamps
    end
  end
end
