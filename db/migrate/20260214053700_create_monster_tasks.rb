class CreateMonsterTasks < ActiveRecord::Migration[7.1]
  def change
    create_table :monster_tasks do |t|
      t.references :monster, null: false, foreign_key: true
      t.references :task, null: false, foreign_key: true
      t.integer :progress
      t.json :user_answer

      t.timestamps
    end
  end
end
