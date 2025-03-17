import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["input", "status"]

  connect() {
    console.log("✅ Autosave controller connected!");

    this.editorElement = document.querySelector("trix-editor");

    // Listen for the mousedown event on the editor to capture click position
    this.editorElement.addEventListener("mousedown", this.setCursorPosition.bind(this));
  }

  save() {
    clearTimeout(this.timeout);
    this.setStatus("Saving...", true); // Show "Saving..."

    this.timeout = setTimeout(() => {
      const content = this.inputTarget.value;
      this.sendData(content);
    }, 1000);
  }

  sendData(content) {
    fetch(this.data.get("url"), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({ content: content })
    })
      .then(response => response.json())
      .then(() => this.setStatus("Saved ✅"))
      .catch(() => this.setStatus("Error ❌", true));
  }

  setStatus(message, show = false) {
    this.statusTarget.textContent = message;
    if (show) {
      this.statusTarget.classList.add("visible");
    }
    clearTimeout(this.statusTimeout);
    this.statusTimeout = setTimeout(() => {
      this.statusTarget.classList.remove("visible");
    }, 1500); // Fades out after 1.5s
  }

  // Function to set the cursor position where the user clicked
  setCursorPosition(event) {
    const editor = event.currentTarget;

    // Ensure the editor is focused
    editor.focus();

    const selection = document.getSelection();
    const range = document.createRange();

    // Get the clicked position (caret position) within the editor
    const position = this.getCaretPositionFromClick(event);

    if (position && position.offsetNode) {
      const node = position.offsetNode;

      // If the node is a #text node, we use the offset directly to set the cursor
      if (node.nodeType === Node.TEXT_NODE) {
        range.setStart(node, position.offset);
        range.setEnd(node, position.offset);

        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // If it's not a text node, we use the editor itself (or handle other cases here)
        range.setStart(editor, 0);
        range.setEnd(editor, 0);

        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else {
      console.warn("❌ Invalid caret position:", position);
    }
  }

  getCaretPositionFromClick(event) {
    const rect = event.target.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    // Try to get the closest text node
    const position = document.caretPositionFromPoint(offsetX, offsetY);

    if (position) {
      return position;
    }
    return null;
  }
}
