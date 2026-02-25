class ChangeDefaultLevelOnStudents < ActiveRecord::Migration[7.1]
  def change
    change_column_default :students, :level, 0
  end
end
