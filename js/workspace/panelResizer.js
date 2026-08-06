// ==========================================
// Workspace Panel Resizer
// Drag-resizable split between the question
// panel and the editor panel.
// ==========================================

import EditorManager from "../editor/editor.js";

const STORAGE_KEY = "workspace-question-panel-width";
const MIN_PERCENT = 20;
const MAX_PERCENT = 70;

class PanelResizer {
  constructor() {
    this.body = document.getElementById("workspace-body");
    this.questionPanel = document.getElementById("question-panel");
    this.handle = document.getElementById("panel-resizer");

    this.dragging = false;
  }

  initialize() {
    if (!this.body || !this.questionPanel || !this.handle) {
      return;
    }

    const savedPercent = Number(localStorage.getItem(STORAGE_KEY));

    if (savedPercent) {
      this.applyPercent(savedPercent);
    }

    this.handle.addEventListener("mousedown", (e) => this.startDrag(e));

    this.handle.addEventListener("keydown", (e) => this.handleKeydown(e));

    window.addEventListener("mousemove", (e) => this.onDrag(e));

    window.addEventListener("mouseup", () => this.endDrag());
  }

  startDrag(e) {
    e.preventDefault();

    this.dragging = true;

    this.handle.classList.add("resizing");

    document.body.classList.add("panel-resizing");
  }

  onDrag(e) {
    if (!this.dragging) {
      return;
    }

    const rect = this.body.getBoundingClientRect();

    const percent = ((e.clientX - rect.left) / rect.width) * 100;

    this.applyPercent(percent);
  }

  endDrag() {
    if (!this.dragging) {
      return;
    }

    this.dragging = false;

    this.handle.classList.remove("resizing");

    document.body.classList.remove("panel-resizing");

    localStorage.setItem(
      STORAGE_KEY,
      String(parseFloat(this.questionPanel.style.flexBasis) || ""),
    );
  }

  handleKeydown(e) {
    const step = 3;

    let current = parseFloat(this.questionPanel.style.flexBasis) || 42;

    if (e.key === "ArrowLeft") {
      current -= step;
    } else if (e.key === "ArrowRight") {
      current += step;
    } else {
      return;
    }

    e.preventDefault();

    this.applyPercent(current);

    localStorage.setItem(STORAGE_KEY, String(current));
  }

  applyPercent(percent) {
    const clamped = Math.min(MAX_PERCENT, Math.max(MIN_PERCENT, percent));

    this.questionPanel.style.flexBasis = `${clamped}%`;

    EditorManager.layout();
  }
}

export default new PanelResizer();
