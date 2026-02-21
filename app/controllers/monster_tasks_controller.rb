class MonsterTasksController < ApplicationController
  # def index
  #   @monsterTasks = MonsterTask.all
  # end

  def show
    @monsterTask = MonsterTask.find(params[:id])
  end

  def new
      @monsterTask = MonsterTask.new
  end

  def create
    @monsterTask = MonsterTask.new(monstertask_params)

    if @monsterTask.save
      redirect_to monster_monster_task_path(@monsterTask)
    else
      render :new, status: :unprocessable_entity
    end

  end

  private
  def monstertask_params
    params.require(:monstertask).permit(:monster_id, :task_id)
  end

end
