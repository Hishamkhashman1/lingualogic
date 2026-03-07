class MonsterTask < ApplicationRecord
  belongs_to :monster
  belongs_to :task

  enum progress: {
    not_started: 0,
    in_progress: 1,
    completed: 2
  }
  # 0 = not_started, 1 = in_prodress, 2 = completed
end
