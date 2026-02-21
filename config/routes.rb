Rails.application.routes.draw do
  devise_for :students
  root to: "pages#home"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  resources :monsters, only: [:new, :create, :show] do
    resources :monster_tasks, only: [:new, :create]
  end
  resources :monster_tasks, only: [:show]
  resources :tasks, only: [:index, :show]

  resources :items, only: [:index, :show]

  resources :user_items, except: [:destroy]

  # Defines the root path route ("/")
  # root "posts#index"
end
