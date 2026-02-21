class AddFieldsToStudents < ActiveRecord::Migration[7.1]
  def change
    add_column :students, :language, :string
    add_column :students, :level, :integer
    add_column :students, :money, :integer
  end
end
