class CreateStudents < ActiveRecord::Migration[7.1]
  def change
    create_table :students do |t|
      t.string :username
      t.string :email
      t.string :language
      t.integer :level
      t.integer :money

      t.timestamps
    end
  end
end
