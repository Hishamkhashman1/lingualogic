class AddRewardsToTasks < ActiveRecord::Migration[7.1]
  def change
    add_column :tasks, :reward_health, :integer
    add_column :tasks, :reward_energy, :integer
    add_column :tasks, :reward_money, :integer
  end
end
