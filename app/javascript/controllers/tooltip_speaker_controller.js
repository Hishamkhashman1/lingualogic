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

    this.delayMs = 320
    this.activeElement = null
    this.pendingTimer = null
    this.pendingText = null
    this.speech = window.speechSynthesis

    this.boundUpdateVoices = this.updateVoices.bind(this)
    this.boundMouseOver = this.onMouseOver.bind(this)
    this.boundMouseOut = this.onMouseOut.bind(this)
    this.boundFocusIn = this.onFocusIn.bind(this)
    this.boundFocusOut = this.onFocusOut.bind(this)

    this.updateVoices()
    this.speech.addEventListener("voiceschanged", this.boundUpdateVoices)

    this.element.addEventListener("mouseover", this.boundMouseOver)
    this.element.addEventListener("mouseout", this.boundMouseOut)
    this.element.addEventListener("focusin", this.boundFocusIn)
    this.element.addEventListener("focusout", this.boundFocusOut)
  }

  disconnect() {
    if (!this.supported) {
      return
    }

    this.clearPending()
    this.cancelSpeech()

    this.element.removeEventListener("mouseover", this.boundMouseOver)
    this.element.removeEventListener("mouseout", this.boundMouseOut)
    this.element.removeEventListener("focusin", this.boundFocusIn)
    this.element.removeEventListener("focusout", this.boundFocusOut)

    if (this.speech) {
      this.speech.removeEventListener("voiceschanged", this.boundUpdateVoices)
    }
  }

  updateVoices() {
    this.voices = this.speech.getVoices()
    this.voice = this.pickVoice(this.voices)
  }

  pickVoice(voices) {
    if (!Array.isArray(voices)) {
      return null
    }

    return (
      voices.find((voice) => voice.lang === "ja-JP") ||
      voices.find((voice) => (voice.lang || "").startsWith("ja")) ||
      null
    )
  }

  onMouseOver(event) {
    const element = this.tooltipElementFor(event.target)
    if (!element) {
      return
    }

    const related = event.relatedTarget
    if (related && element.contains(related)) {
      return
    }

    this.queueSpeak(element)
  }

  onMouseOut(event) {
    const element = this.tooltipElementFor(event.target)
    if (!element) {
      return
    }

    const related = event.relatedTarget
    if (related && element.contains(related)) {
      return
    }

    this.stopSpeak()
  }

  onFocusIn(event) {
    const element = this.tooltipElementFor(event.target)
    if (!element) {
      return
    }

    this.queueSpeak(element)
  }

  onFocusOut(event) {
    const element = this.tooltipElementFor(event.target)
    if (!element) {
      return
    }

    const related = event.relatedTarget
    if (related && element.contains(related)) {
      return
    }

    this.stopSpeak()
  }

  tooltipElementFor(target) {
    if (!target || !(target instanceof Element)) {
      return null
    }

    const element = target.closest(".has-tooltip")
    if (!element || !this.element.contains(element)) {
      return null
    }

    return element
  }

  queueSpeak(element) {
    if (!this.supported) {
      return
    }

    const text = element.getAttribute("data-tooltip")
    if (!text) {
      return
    }

    this.clearPending()
    this.cancelSpeech()

    this.activeElement = element
    this.pendingText = text
    this.pendingTimer = window.setTimeout(() => {
      if (this.activeElement !== element) {
        return
      }

      this.speak(text)
    }, this.delayMs)
  }

  speak(text) {
    if (!this.supported || !text) {
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "ja-JP"
    utterance.rate = 1.0
    utterance.pitch = 1.0

    if (this.voice) {
      utterance.voice = this.voice
    }

    this.speech.speak(utterance)
  }

  stopSpeak() {
    this.clearPending()
    this.cancelSpeech()
    this.activeElement = null
    this.pendingText = null
  }

  clearPending() {
    if (this.pendingTimer) {
      window.clearTimeout(this.pendingTimer)
      this.pendingTimer = null
    }
  }

  cancelSpeech() {
    if (this.speech) {
      this.speech.cancel()
    }
  }
}
