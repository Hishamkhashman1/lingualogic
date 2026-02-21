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

Monster.destroy_all
Task.destroy_all

puts "Creating test seeds..."

# test_user = Student.create!(email: "testing@testing.test", encrypted_password: "123456", reset_password_token: "123456");

test_monster = Monster.create!(name: "Testasaur", student_id: 1, happiness: 1, energy: 100, species_type: "bulbasaur");

test_task = Task.create!(goal: "Set speed to 800", difficulty: 0)

puts "Seeding finished."
