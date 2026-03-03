import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="monster-tasks"
export default class extends Controller {
  static targets = ["claim"]

  connect() {
    console.log("rewards connected")

    //get values of rewards
    //call update on ruby controller
  }
}
