class Task < ApplicationRecord
  has_many :monster_tasks
  has_many :monsters, through: :monster_tasks

  store_accessor :reward, :exp, :item1, :item2

  def self.available_for(student)
    monster = student.monster
    student_level = student.level
    completed_task_ids = monster.monster_tasks.pluck(:task_id)

    where.not(id: completed_task_ids)
    .where("difficulty <= ?", student.level)
    .order(:difficulty)
  end
end
