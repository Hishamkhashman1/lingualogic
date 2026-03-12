class MonstersController < ApplicationController

  def new
    @monster = Monster.new
  end

  def create
    @monster = Monster.new(params.require(:monster).permit(:name, :species_type))
    @monster.student = current_student
    @monster.save

    redirect_to monster_path(@monster)

  end

  def show
    @monster = Monster.find(params[:id])
    # @tasks = Task.all
    @items =  Item.all
    @student_items = StudentItem.all
    @my_items = @student_items.where(student_id: current_student)
    @current_student = current_student

    @student_items = StudentItem.where(student_id: @current_student.id)
    @tasks = Task.all
    # @tasks = []
    # task = MonsterEnergyService.check_and_assign(@monster)
    # @tasks << task if task.present?
    # @tasks.compact

    active_monster_task = @monster.monster_tasks.joins(:task).find_by(completed: false)

      if active_monster_task
        @task = active_monster_task.task
      else
        @task = MonsterEnergyService.check_and_assign(@monster)

        TaskNotificationService.check(current_student) if @task
      end

        @notifications = Notification.where(student: current_student, read: false)
  end

  def equip
    @monster = Monster.find(params[:id])
    current_item = Item.find(params[:item_id])

    if ((@monster.accessory == "none") || (@monster.accessory == nil))
      @monster.update(accessory: current_item.name)
      puts "Equipped!"
    else
      @monster.update(accessory: "none")
      puts "Removed!"
    end

    respond_to do |format|
      format.turbo_stream
      format.html { redirect_to monster_path(@monster) }
    end
  end

end
