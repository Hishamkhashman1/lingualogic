class TasksController < ApplicationController
  before_action :authenticate_user!

  def index
    tasks = Task.available_for(current_user)

    render json: tasks
  end

  def show
    task = Task.available_for(current_user).find(params[:id])
    render json: task
  end
end
