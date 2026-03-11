class MonsterTasksController < ApplicationController
  # def index
  #   @monsterTasks = MonsterTask.all
  # end

  def show
    @monster = MonsterTask.find(params[:id]).monster_id
    @monster_task = MonsterTask.find(params[:id])
  end

  def new
      @monster_task = MonsterTask.new
  end

 def create
  @monster_task = MonsterTask.new(monstertask_params)
  @monster_task.monster = Monster.find(params[:monster_id])

  if @monster_task.save

    # marca notification como lida
    notification = Notification.find_by(
      student: current_student,
      task_id: @monster_task.task_id,
      read: false
    )

    notification.update(read: true) if notification

    redirect_to monster_task_path(@monster_task)
  else
    render :new, status: :unprocessable_entity
  end
end

  #custom method to distribute rewards by updating monster, student, student_items table
  #run on click of claim rewards functions
  def rewards
  @monster_task = MonsterTask.find(params[:id])
  monster = @monster_task.monster
  @task = @monster_task.task
  student = current_student

  @monster_task.update(progress: :completed)

  monster.update(
    health: monster.health + (@task.reward_health || 0),
    energy: monster.energy + (@task.reward_energy || 0)
  )

  student.update(
    exp: student.exp + (@task.reward_exp || 0)
  )

  # ⬇️ AQUI aumenta o level após completar a task 1
  if @task.difficulty == 1
    student.update(level: 5)
  end

  if @task.reward_item1.present?
    item = Item.find_by(name: @task.reward_item1)

    current_item = StudentItem.find_or_initialize_by(
      student_id: student.id,
      item_id: item.id
    )

    current_item.qty ||= 0
    current_item.qty += 1
    current_item.save
  end

  if @task.reward_item2.present?
    item = Item.find_by(name: @task.reward_item2)

    current_item = StudentItem.find_or_initialize_by(
      student_id: student.id,
      item_id: item.id
    )

    current_item.qty ||= 0
    current_item.qty += 1
    current_item.save
  end

  TaskNotificationService.check(student)

  puts "Rewards claimed in database!"
end
end

  private
  def monstertask_params
    params.require(:monster_task).permit(:monster_id, :task_id)
  end
