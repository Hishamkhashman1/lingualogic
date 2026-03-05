class MonsterEnergyService
  LOW_ENERGY = 20

  def self.check_and_assign(monster)
    return unless monster.energy <= LOW_ENERGY

    existing_task = monster.monster_tasks.joins(:task).find_by(tasks: { goal: "Feed monster" })
    return if existing_task.present?

    level = monster.student.level

    task = Task.find_by(goal: "Feed monster", difficulty: level)
    # return unless task.nil?

    # monster_possible_tasks = task.all

  # if notification.new_record?
  #     notification.message = "I am hungry! Give me apple 🍎"
  #     notification.read = false
  #     notification.save!
  #   end
  end
end
