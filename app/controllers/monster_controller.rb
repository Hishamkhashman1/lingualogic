class MonsterController < ApplicationController

  def new
    @monster = Monster.new
  end

  def create
    @monster = Monster.new(:name, :species_type)
    @monster.student = current_student
  end

  def show
    @monster = Monster.find(params[:id])
  end

end
