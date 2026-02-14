class CreateTasks < ActiveRecord::Migration[7.1]
  def change
    create_table :tasks do |t|
      t.string :goal
      t.jsonb :answer_options
      t.jsonb :right_answer
      t.jsonb :reward
      t.integer :difficulty
      t.integer :attempts

      t.timestamps
    end
  end
end
