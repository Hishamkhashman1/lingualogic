import { Controller } from "@hotwired/stimulus"

// Updates task buttons based on localStorage completion markers.
export default class extends Controller {
  static targets = ["button"]
  static values = {
    monsterId: Number,
  }

  connect() {
    this.applyStoredState()
  }

  applyStoredState() {
    if (!this.hasMonsterIdValue) return

    this.buttonTargets.forEach((button) => {
      const taskId = button.dataset.taskId
      if (!taskId) return

      const key = this.storageKey(taskId)
      if (this.isDone(key)) {
        this.setDoneLabel(button)
      }
    })
  }

  storageKey(taskId) {
    return `lingualogic:monster:${this.monsterIdValue}:task:${taskId}`
  }

  isDone(key) {
    try {
      return localStorage.getItem(key) === "done"
    } catch (e) {
      return false
    }
  }

  setDoneLabel(button) {
    if (button.tagName === "INPUT") {
      button.value = "Completed"
    } else {
      button.textContent = "Completed"
    }
    button.disabled = true
    button.setAttribute("aria-disabled", "true")
    button.style.opacity = "0.5"
    button.style.filter = "grayscale(1)"
    button.style.cursor = "not-allowed"
  }
}
