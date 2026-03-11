import { Controller } from "@hotwired/stimulus"

// Animates the health bar from the previous stored value to current value.
export default class extends Controller {
  static targets = ["bar", "track"]
  static values = {
    monsterId: Number,
    current: Number,
  }

  connect() {
    const prev = this.getPrev()
    if (prev == null || Number.isNaN(prev)) return
    if (!this.hasCurrentValue || Number.isNaN(this.currentValue)) return
    if (!this.hasTrackTarget) return

    const durationMs = 1800
    this.trackTarget.classList.add("is-animating")
    this.barTarget.style.width = `${prev}%`
    requestAnimationFrame(() => {
      this.barTarget.style.width = `${this.currentValue}%`
    })

    setTimeout(() => {
      this.trackTarget.classList.remove("is-animating")
    }, durationMs)

    this.clearPrev()
  }

  storageKey() {
    return `lingualogic:monster:${this.monsterIdValue}:prevHealth`
  }

  getPrev() {
    if (!this.hasMonsterIdValue) return null
    try {
      const raw = localStorage.getItem(this.storageKey())
      return raw == null ? null : Number(raw)
    } catch (e) {
      return null
    }
  }

  clearPrev() {
    try {
      localStorage.removeItem(this.storageKey())
    } catch (e) {
      // ignore
    }
  }
}
