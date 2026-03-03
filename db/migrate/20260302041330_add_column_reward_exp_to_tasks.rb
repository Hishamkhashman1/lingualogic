class AddColumnRewardExpToTasks < ActiveRecord::Migration[7.1]
  def change
    add_column :tasks, :reward_exp, :integer
    add_column :tasks, :reward_item1, :string
    add_column :tasks, :reward_item2, :string
  end
end
