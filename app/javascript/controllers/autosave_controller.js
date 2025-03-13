import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["input", "status"];

  connect() {
    console.log("✅ Autosave controller connected!");
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
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify({ content: content }),
    })
      .then((response) => response.json())
      .then(() => {
        console.log("✅ Saved successfully!");
        this.setStatus("Saved ✅");
      })
      .catch((error) => {
        console.error("❌ Error saving:", error);
        this.setStatus("Error ❌", true);
      });
  }

  setStatus(message, show = false) {
    console.log(`Setting status: ${message}`);
    this.statusTarget.textContent = message;

    if (show) {
      this.statusTarget.classList.add("visible");
    }

    clearTimeout(this.statusTimeout);
    this.statusTimeout = setTimeout(() => {
      this.statusTarget.classList.remove("visible");
    }, 1500); // Fades out after 1.5s
  }
}
