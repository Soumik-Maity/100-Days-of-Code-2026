// ==========================================
// Monaco Editor Manager
// ==========================================

class EditorManager {
  constructor() {
    this.editor = null;
    this.loadingContent = false;

    this.minFontSize = 12;
    this.maxFontSize = 24;

    this.fontSize = Number(localStorage.getItem("editor-font-size")) || 15;
  }
  layout() {
    if (this.editor) {
      this.editor.layout();
    }
  }
  /**
   * Initialize Monaco Editor.
   */
  initialize() {
    require.config({
      paths: {
        vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs",
      },
    });

    require(["vs/editor/editor.main"], () => {
      requestAnimationFrame(() => {
        this.editor = monaco.editor.create(
          document.getElementById("editor-container"),
          {
            value: this.defaultTemplate(),
            language: "c",
            theme: "vs-dark",

            contextmenu: false,

            automaticLayout: true,
            fontSize: this.fontSize,

            minimap: {
              enabled: false,
            },

            roundedSelection: true,
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 4,
            insertSpaces: true,
            renderWhitespace: "selection",
            autoClosingBrackets: "always",
          },
        );
        const fontLabel = document.getElementById("editor-font-size");

        if (fontLabel) {
          fontLabel.textContent = this.fontSize;
        }
        const label = document.getElementById("editor-font-size");

        if (label) label.textContent = this.fontSize;
        this.editor.onDidChangeModelContent(() => {
          if (this.loadingContent) {
            return;
          }
          const status = document.getElementById("editor-save-status");

          status.textContent = "Unsaved";

          status.classList.remove("saved");

          status.classList.add("unsaved");
        });

        // ==========================================
        // Disable Paste (Ctrl+V / Cmd+V / Shift+Insert)
        // ==========================================

        this.editor.addCommand(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV,
          () => {},
        );

        this.editor.addCommand(
          monaco.KeyMod.Shift | monaco.KeyCode.Insert,
          () => {},
        );

        // ==========================================
        // Disable Drag & Drop
        // ==========================================

        const domNode = this.editor.getDomNode();

        domNode.addEventListener("dragover", (e) => e.preventDefault());

        domNode.addEventListener("drop", (e) => e.preventDefault());

        // ==========================================
        // Disable Browser Paste Event
        // ==========================================

        domNode.addEventListener("paste", (e) => {
          e.preventDefault();
        });
      });
    });
  }
  /**
   * Default template.
   */
  defaultTemplate() {
    return `#include <stdio.h>

int main() {

    return 0;

}
`;
  }

  /**
   * Get editor code.
   */
  getCode() {
    if (!this.editor) {
      return "";
    }

    return this.editor.getValue();
  }

  /**
   * Set editor code.
   */
  setCode(code) {
    if (!this.editor) {
      return;
    }
    this.loadingContent = true;
    this.editor.setValue(code);
    this.loadingContent = false;
  }

  /**
   * Focus editor.
   */
  focus() {
    if (this.editor) {
      this.editor.focus();
    }
  }
  // ==========================================
  // Reset Editor
  // ==========================================

  resetEditor() {
    if (!this.editor) return;

    this.setCode(this.defaultTemplate());

    const status = document.getElementById("editor-save-status");

    status.textContent = "Unsaved";

    status.classList.remove("saved");

    status.classList.add("unsaved");

    this.focus();
  }

  // ==========================================
  // Font Size
  // ==========================================

  increaseFont() {
    if (!this.editor) return;

    if (this.fontSize >= this.maxFontSize) return;

    this.fontSize++;

    this.applyFontSize();
  }

  decreaseFont() {
    if (!this.editor) return;

    if (this.fontSize <= this.minFontSize) return;

    this.fontSize--;

    this.applyFontSize();
  }

  applyFontSize() {
    this.editor.updateOptions({
      fontSize: this.fontSize,
    });

    localStorage.setItem("editor-font-size", this.fontSize);

    const label = document.getElementById("editor-font-size");

    if (label) label.textContent = this.fontSize;
  }

  getFontSize() {
    return this.fontSize;
  }
}

export default new EditorManager();
