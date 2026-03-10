# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# puts "Cleaning database..."
Item.destroy_all
MonsterTask.destroy_all
Task.destroy_all
Monster.destroy_all
Student.destroy_all

puts "Creating test seeds..."

test_user = Student.create!(email: "testing@testing.test", password: "123456");

# test_monster = Monster.create!(name: "Testasaur", student_id: 1, happiness: 1, energy: 100, species_type: "bulbasaur", image: "https://archives.bulbagarden.net/media/upload/f/fb/0001Bulbasaur.png");

# test_task = Task.create!(goal: "Set speed to 800", difficulty: 0)

task_level1 = Task.create!(goal: "First task", difficulty: 1, reward_exp: 100, reward_item1: "apple", reward_item2: "funny_hat", name: "level1")
task_level5 = Task.create!(goal: "Feed monster", difficulty: 2, reward_exp: 150, reward_health: 20, reward_energy: 10, reward_item1: "apple", name: "level5")

item_apple = Item.create!(price: 25, description: "+ energy", accessory: false, name: "apple", image: "apple-s.png")
item_hat = Item.create!(price: 100, description: "hat", accessory: true, name: "funny_hat", image: "top_hat.png")

puts "Seeding finished."
