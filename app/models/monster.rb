class Monster < ApplicationRecord
  belongs_to :student
  has_many :tasks, through: :monster_tasks

  validates :student_id, presence: true
  validates :name, presence: true

end
