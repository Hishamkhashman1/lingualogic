class CreateMonsters < ActiveRecord::Migration[7.1]
  def change
    create_table :monsters do |t|
      t.references :student, null: false, foreign_key: true
      t.string :name
      t.integer :happiness
      t.integer :energy
      t.string :species_type

      t.timestamps
    end
  end
end
