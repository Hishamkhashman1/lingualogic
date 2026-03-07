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
      redirect_to monster_task_path(@monster_task)
    else
      render :new, status: :unprocessable_entity
    end

    # "monster_task"=>{"task_id"=>"1"}, "commit"=>"Do Task", "monster_id"=>"1"
  end

  #custom method to distribute rewards by updating monster, student, student_items table
  #run on click of claim rewards functions
  def rewards
    @monster_task = MonsterTask.find(params[:id])
    monster = @monster_task.monster
    @task = @monster_task.task
    student = current_student

    monster.update(health: monster.health + (@task.reward_health.nil? ? 0 : @task.reward_health), energy: monster.energy + (@task.reward_energy.nil? ? 0 : @task.reward_energy))
    student.update(exp: student.exp + (@task.reward_exp.nil? ? 0 : @task.reward_exp))

    # make this a method for each item#
    if @task.item1.present?
      item = Item.find_by(name: @task.reward_item1)

      if StudentItem.where(student_id: student.id).where(item_id: item.id).present?
        current_item = StudentItem.where(student_id: student.id).where(item_id: item.id).first
        current_item.qty = (current_item.qty + 1)
        current_item.save
      else
        StudentItem.create!(student_id: student.id, item_id: item.id, qty: 1)
      end
    end

    if @task.item2.present?
      item = Item.find_by(name: @task.reward_item2)

      if StudentItem.where(student_id: student.id).where(item_id: item.id).any?
        current_item = StudentItem.where(student_id: student.id).where(item_id: item.id).first
        current_item.qty += 1
        current_item.save
      else
        StudentItem.create!(student_id: student.id, item_id: item.id, qty: 1)
      end
    end

    puts "Rewards claimed in database!"

  end

  private
  def monstertask_params
    params.require(:monster_task).permit(:monster_id, :task_id)
  end

end
