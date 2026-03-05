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
    @items =  Item.all
    @student_items = StudentItem.all
    @my_items = @student_items.where(student_id: current_student)
    @current_student = current_student
    # @student_items = StudentItem.where(StudentItem.student_id == current_student.id)
    @tasks = []
    task = MonsterEnergyService.check_and_assign(@monster)
    @tasks << task if task.present?
    @tasks.compact
  end
end
