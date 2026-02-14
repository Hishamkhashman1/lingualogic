class Student < ApplicationRecord
  has_many :monsters
  has_many :items, through: :student_items
  has_one :guardian

  validates :username, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true
end
