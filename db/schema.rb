# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2026_02_21_025118) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "items", force: :cascade do |t|
    t.integer "price"
    t.integer "effect"
    t.string "description"
    t.boolean "accessory"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "monster_tasks", force: :cascade do |t|
    t.bigint "monster_id", null: false
    t.bigint "task_id", null: false
    t.integer "progress"
    t.json "user_answer"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["monster_id"], name: "index_monster_tasks_on_monster_id"
    t.index ["task_id"], name: "index_monster_tasks_on_task_id"
  end

  create_table "monsters", force: :cascade do |t|
    t.bigint "student_id", null: false
    t.string "name"
    t.integer "happiness"
    t.integer "energy"
    t.string "species_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["student_id"], name: "index_monsters_on_student_id"
  end

  create_table "student_items", force: :cascade do |t|
    t.bigint "student_id", null: false
    t.bigint "item_id", null: false
    t.integer "qty"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_student_items_on_item_id"
    t.index ["student_id"], name: "index_student_items_on_student_id"
  end

  create_table "students", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "language"
    t.integer "level"
    t.integer "money"
    t.index ["email"], name: "index_students_on_email", unique: true
    t.index ["reset_password_token"], name: "index_students_on_reset_password_token", unique: true
  end

  create_table "tasks", force: :cascade do |t|
    t.string "goal"
    t.jsonb "answer_options"
    t.jsonb "right_answer"
    t.jsonb "reward"
    t.integer "difficulty"
    t.integer "attempts"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "monster_tasks", "monsters"
  add_foreign_key "monster_tasks", "tasks"
  add_foreign_key "monsters", "students"
  add_foreign_key "student_items", "items"
  add_foreign_key "student_items", "students"
end
