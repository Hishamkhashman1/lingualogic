class StudentItem < ApplicationRecord
  belongs_to :student
  belongs_to :item
end
