import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["overlay", "label"]

  connect() {
    this.minDuration = 4000
    this.shownAt = 0
    this.hideTimer = null
    this.beforeVisit = this.beforeVisit.bind(this)
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)
    this.submitStart = this.submitStart.bind(this)
    this.submitEnd = this.submitEnd.bind(this)
    this.beforeCache = this.beforeCache.bind(this)

    document.addEventListener("turbo:before-visit", this.beforeVisit)
    document.addEventListener("turbo:visit", this.show)
    document.addEventListener("turbo:submit-start", this.submitStart)
    document.addEventListener("turbo:submit-end", this.submitEnd)
    document.addEventListener("turbo:load", this.hide)
    document.addEventListener("turbo:render", this.hide)
    document.addEventListener("turbo:before-cache", this.beforeCache)
  }

  disconnect() {
    document.removeEventListener("turbo:before-visit", this.beforeVisit)
    document.removeEventListener("turbo:visit", this.show)
    document.removeEventListener("turbo:submit-start", this.submitStart)
    document.removeEventListener("turbo:submit-end", this.submitEnd)
    document.removeEventListener("turbo:load", this.hide)
    document.removeEventListener("turbo:render", this.hide)
    document.removeEventListener("turbo:before-cache", this.beforeCache)
  }

  beforeVisit(event) {
    if (event?.detail?.url) {
      this.show()
    }
  }

  submitStart(event) {
    const form = event?.target?.closest?.("form") || event?.target
    if (form?.dataset?.pageTransitionIgnore === "true") return
    if (form?.closest?.("[data-page-transition-ignore=\"true\"]")) return
    this.show()
  }

  submitEnd(event) {
    if (event?.detail?.success === false) {
      this.hide()
    }
  }

  beforeCache() {
    this.hide()
  }

  show() {
    if (!this.hasOverlayTarget) return
    if (this.hideTimer) {
      clearTimeout(this.hideTimer)
      this.hideTimer = null
    }
    this.shownAt = Date.now()
    this.overlayTarget.classList.add("is-active")
    this.overlayTarget.setAttribute("aria-hidden", "false")
  }

  hide() {
    if (!this.hasOverlayTarget) return
    const elapsed = Date.now() - this.shownAt
    const remaining = this.minDuration - elapsed
    if (remaining > 0) {
      if (this.hideTimer) clearTimeout(this.hideTimer)
      this.hideTimer = setTimeout(() => {
        this.overlayTarget.classList.remove("is-active")
        this.overlayTarget.setAttribute("aria-hidden", "true")
        this.hideTimer = null
      }, remaining)
      return
    }
    this.overlayTarget.classList.remove("is-active")
    this.overlayTarget.setAttribute("aria-hidden", "true")
  }
}
