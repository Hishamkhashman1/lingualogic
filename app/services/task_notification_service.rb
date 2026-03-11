class TaskNotificationService
  def self.check(student)
    monster = student.monster
    return unless monster

    # pega próxima task disponível
    task = Task.available_for(student).first
    return unless task

    # evita criar notification duplicada
    return if Notification.exists?(student: student, task: task)

    # verifica se já completou alguma task
    completed_tasks = monster.monster_tasks.where(progress: :completed).count

    message =
      if completed_tasks > 0
        "Great job! I have another quest for you!"
      else
        "Oh! Seems like you have your first task!"
      end

    Notification.create!(
      student: student,
      task: task,
      message: message,
      read: false
    )
  end
end
