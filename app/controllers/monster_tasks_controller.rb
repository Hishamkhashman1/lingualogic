class MonsterTasksController < ApplicationController
  def index
    @monsterTasks = MonsterTask.all
  end

  def show
    @monsterTask = MonsterTask.find(params[:id])
  end
end
