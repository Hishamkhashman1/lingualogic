import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="inventory-wearing"
export default class extends Controller {

  static values = {
    wearing: String
  }

  static targets = ["wearingmsg"]

  connect() {
    console.log("Wearing controller connected")
  }

  wearingupdate() {
    this.wearingmsgTarget.innerText = ( "Now wearing: " + this.wearingValue )
  }
}
