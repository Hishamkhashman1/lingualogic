import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.supported =
      typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      typeof SpeechSynthesisUtterance !== "undefined"

    if (!this.supported) {
      return
    }

    this.speech = window.speechSynthesis
    this.voices = []
    this.voice = null
    this.pendingText = null
    this.waitingForVoices = false
    this.boundVoicesChanged = this.onVoicesChanged.bind(this)

    this.ensureVoices()
  }

  disconnect() {
    if (!this.supported || !this.speech) {
      return
    }

    this.speech.removeEventListener("voiceschanged", this.boundVoicesChanged)
  }

  speak(event) {
    if (!this.supported || !this.speech) {
      return
    }

    if (event) {
      if (event.type === "keydown") {
        event.preventDefault()
      }
      event.stopPropagation()
    }

    if (this.speech.speaking || this.speech.pending) {
      this.speech.cancel()
      return
    }

    const button = event?.currentTarget || event?.target
    const host = this.findTooltipHost(button)
    if (!host) {
      return
    }

    const text = host.getAttribute("data-tooltip")
    if (!text) {
      return
    }

    if (!this.ensureVoices()) {
      this.pendingText = text
      return
    }

    this.speakText(text)
  }

  blockDrag(event) {
    if (!event) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
  }

  ensureVoices() {
    const voices = this.speech.getVoices()

    if (!voices || voices.length === 0) {
      if (!this.waitingForVoices) {
        this.waitingForVoices = true
        this.speech.addEventListener("voiceschanged", this.boundVoicesChanged)
      }
      return false
    }

    this.waitingForVoices = false
    this.speech.removeEventListener("voiceschanged", this.boundVoicesChanged)
    this.voices = voices
    this.voice = this.pickVoice(voices)
    return true
  }

  onVoicesChanged() {
    if (!this.ensureVoices()) {
      return
    }

    if (this.pendingText) {
      const text = this.pendingText
      this.pendingText = null
      this.speakText(text)
    }
  }

  pickVoice(voices) {
    if (!Array.isArray(voices)) {
      return null
    }

    return (
      voices.find((voice) => (voice.lang || "") === "ja-JP") ||
      voices.find((voice) => (voice.lang || "").startsWith("ja")) ||
      null
    )
  }

  findTooltipHost(button) {
    if (!button || !(button instanceof Element)) {
      return null
    }

    const closest = button.closest("[data-tooltip]")
    if (closest && closest !== button) {
      return closest
    }

    const parent = button.parentElement
    if (!parent) {
      return null
    }

    if (parent.hasAttribute("data-tooltip")) {
      return parent
    }

    return parent.querySelector("[data-tooltip]")
  }

  speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "ja-JP"
    utterance.rate = 1.0
    utterance.pitch = 1.0

    if (this.voice) {
      utterance.voice = this.voice
    }

    this.speech.speak(utterance)
  }
}
