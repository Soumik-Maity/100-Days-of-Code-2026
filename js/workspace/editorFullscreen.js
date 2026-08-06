// ==========================================
// Editor Fullscreen Toggle
// ==========================================

import EditorManager from "../editor/editor.js";

class EditorFullscreen {
  constructor() {
    this.button = document.getElementById("editor-fullscreen-button");
    this.editorPanel = document.getElementById("editor-panel");

    this.active = false;
  }

  initialize() {
    if (!this.button || !this.editorPanel) {
      return;
    }

    this.button.addEventListener("click", () => this.toggle());

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.active) {
        this.exit();
      }
    });
  }

  toggle() {
    if (this.active) {
      this.exit();
    } else {
      this.enter();
    }
  }

  enter() {
    this.active = true;

    this.editorPanel.classList.add("is-fullscreen");

    document.body.classList.add("editor-fullscreen-active");

    this.button.setAttribute("aria-pressed", "true");

    this.button.title = "Exit Full Screen";

    EditorManager.layout();

    EditorManager.focus();
  }

  exit() {
    this.active = false;

    this.editorPanel.classList.remove("is-fullscreen");

    document.body.classList.remove("editor-fullscreen-active");

    this.button.setAttribute("aria-pressed", "false");

    this.button.title = "Full Screen";

    EditorManager.layout();
  }
}

export default new EditorFullscreen();
