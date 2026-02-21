class MonsterTasksController < ApplicationController
  # def index
  #   @monsterTasks = MonsterTask.all
  # end

  def show
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

  private
  def monstertask_params
    params.require(:monster_task).permit(:monster_id, :task_id)
  end

end
