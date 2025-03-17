import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    this.element.addEventListener("mousedown", this.setCursorPosition);
  }

  setCursorPosition(event) {
    const editor = event.currentTarget;
    const selection = window.getSelection();
    const range = document.caretRangeFromPoint(event.clientX, event.clientY);

    if (selection && range) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}
