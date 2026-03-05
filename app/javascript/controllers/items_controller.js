import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="items"
export default class extends Controller {
  static targets = [ 'itemlist', 'inventory' ]
  connect() {
    console.log("Inventory connected");
  }

  toggle() {
    console.log("Toggled inventory visibility");
    this.itemlistTarget.classList.toggle("hidden");
    }
  }
