class NotificationService
  def initialize(user)
    @user = user
  end

  def notify_new_tasks
    available_tasks.each do |task|
      next if already_notified?(task)

      create_notification(task)
    end
  end

  private

  def available_tasks
    Task.available_for(@user)
  end

  def already_notified?(task)
    Notification.exists?(user: @user, task: task, kind: "task_available")
  end

  def create_notification(task)
    Notification.create!(
      user: @user,
      task: task,
      kind: "task_available"
    )
  end
end
