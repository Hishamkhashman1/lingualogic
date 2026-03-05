class Notification < ApplicationRecord
  belongs_to :student
  belongs_to :task

  validates :message, presence: true
end
