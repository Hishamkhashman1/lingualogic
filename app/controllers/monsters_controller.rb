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
    @tasks = Task.all
  end

end
