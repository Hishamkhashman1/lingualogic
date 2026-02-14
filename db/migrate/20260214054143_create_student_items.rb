class CreateStudentItems < ActiveRecord::Migration[7.1]
  def change
    create_table :student_items do |t|
      t.references :student, null: false, foreign_key: true
      t.references :item, null: false, foreign_key: true
      t.integer :qty

      t.timestamps
    end
  end
end
