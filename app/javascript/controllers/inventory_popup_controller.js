import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="inventory-popup"
export default class extends Controller {
  static targets = ["panel", "backdrop", "trigger"]

  connect() {
    this.handleKey = this.handleKey.bind(this)
  }

  toggle() {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  open() {
    if (this.isOpen) return

    this.element.classList.add("is-open")
    if (this.hasTriggerTarget) this.triggerTarget.setAttribute("aria-expanded", "true")
    if (this.hasPanelTarget) this.panelTarget.setAttribute("aria-hidden", "false")
    if (this.hasBackdropTarget) this.backdropTarget.setAttribute("aria-hidden", "false")
    document.addEventListener("keydown", this.handleKey)
  }

  close() {
    if (!this.isOpen) return

    this.element.classList.remove("is-open")
    if (this.hasTriggerTarget) this.triggerTarget.setAttribute("aria-expanded", "false")
    if (this.hasPanelTarget) this.panelTarget.setAttribute("aria-hidden", "true")
    if (this.hasBackdropTarget) this.backdropTarget.setAttribute("aria-hidden", "true")
    document.removeEventListener("keydown", this.handleKey)
  }

  handleKey(event) {
    if (event.key === "Escape") {
      this.close()
    }
  }

  get isOpen() {
    return this.element.classList.contains("is-open")
  }

  disconnect() {
    document.removeEventListener("keydown", this.handleKey)
  }
}
