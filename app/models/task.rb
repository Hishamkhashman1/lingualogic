class Task < ApplicationRecord
  has_many :monster_tasks
  def self.available_for(user)
    monster = user.monster

    completed_task_ids = monster.monster_tasks.pluck(:task_id)

    where.not(id: completed_task_ids)
  end
end
