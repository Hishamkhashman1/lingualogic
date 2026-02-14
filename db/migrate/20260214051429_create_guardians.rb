class CreateGuardians < ActiveRecord::Migration[7.1]
  def change
    create_table :guardians do |t|
      t.string :email
      t.references :student, null: false, foreign_key: true
      t.string :name

      t.timestamps
    end
  end
end
