class TaskNotificationService
  def self.check(student)
    monster = student.monster
    return none unless monster

    task = Task.available_for(student).first
    return unless task

    existing = Notification.where(
      student: student,
      task: task
    ).exists?

    return if existing

    Notification.create(
      student: student,
      task: task,
      message: "Oh! Seems like you have your first task!"
    )
  end
end
