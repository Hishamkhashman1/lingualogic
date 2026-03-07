class ChangeDefaultMonsterTaskProgress < ActiveRecord::Migration[7.1]
  def change
    change_column :monster_tasks, :progress, :integer, default: 0
  end
end
