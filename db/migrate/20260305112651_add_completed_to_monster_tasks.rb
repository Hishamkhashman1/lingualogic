class AddCompletedToMonsterTasks < ActiveRecord::Migration[7.1]
  def change
    add_column :monster_tasks, :completed, :boolean, default: false
  end
end
