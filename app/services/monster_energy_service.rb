class MonsterEnergyService
  LOW_ENERGY = 20

  def self.check_and_assign(monster)
    return unless monster.energy <= LOW_ENERGY

    existing_task = monster.monster_tasks.joins(:task).find_by(tasks: { goal: "Feed monster" })
    return if existing_task.present?

    level = monster.student.level

    task = Task.find_by(difficulty: level)
    return  task.nil?
  end
end
