class AddExpToStudents < ActiveRecord::Migration[7.1]
  def change
    add_column :students, :exp, :integer, default: 0
  end
end
