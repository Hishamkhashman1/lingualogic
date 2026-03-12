# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

puts "Cleaning database..."
Notification.destroy_all
StudentItem.destroy_all
MonsterTask.destroy_all
Item.destroy_all
Task.destroy_all
Monster.destroy_all
Student.destroy_all

puts "Creating test seeds..."

test_user = Student.create!(email: "testing@testing.test", password: "123456");

test_monster = Monster.create!(name: "Testasaur", student_id: test_user.id, health: 50, energy: 50, species_type: "bulbasaur", image: "https://archives.bulbagarden.net/media/upload/f/fb/0001Bulbasaur.png");

task_level1 = Task.create!(goal: "First task", difficulty: 1, reward_exp: 100, reward_item1: "apple", reward_item2: "funny hat", name: "level1")
task_level2 = Task.create!(goal: "Learn to jump", difficulty: 2, reward_exp: 100, reward_item1: "apple", reward_item2: "funny hat", name: "level1")
task_level3 = Task.create!(goal: "IF command", difficulty: 3, reward_exp: 100, reward_item1: "apple", reward_item2: "funny hat", name: "level1")
task_level4 = Task.create!(goal: "AND command", difficulty: 4, reward_exp: 100, reward_item1: "apple", reward_item2: "funny hat", name: "level1")
task_level5 = Task.create!(goal: "Feed monster", difficulty: 5, reward_exp: 150, reward_health: 20, reward_energy: 10, reward_item1: "apple", name: "level5")
task_level6 = Task.create!(goal: "Get energy - OR command", difficulty: 6, reward_exp: 150, reward_health: 0, reward_energy: 25, reward_item1: "apple", name: "level6")


item_apple = Item.create!(price: 25, description: "+ energy", accessory: false, name: "apple", image: "apple-s.png")
item_hat = Item.create!(price: 100, description: "hat", accessory: true, name: "funny hat", image: "top-hat.png")

puts "Seeding finished."
