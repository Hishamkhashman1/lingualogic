# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin_all_from "app/javascript/tasks", under: "tasks"
pin "bootstrap", to: "bootstrap.min.js", preload: true
pin "@popperjs/core", to: "popper.js", preload: true
pin "tasks/platform", to: "tasks/platform.js"
pin "tasks/test", to: "tasks/test.js"
pin "phaser", to: "https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.esm.js"
