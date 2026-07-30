// ==========================================
// Monaco Editor Manager
// ==========================================

class EditorManager {
  constructor() {
    this.editor = null;
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
            fontSize: 15,

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
          }
        );
        this.editor.onDidChangeModelContent(() => {
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
          () => {}
        );

        this.editor.addCommand(
          monaco.KeyMod.Shift | monaco.KeyCode.Insert,
          () => {}
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

    this.editor.setValue(code);
  }

  /**
   * Focus editor.
   */
  focus() {
    if (this.editor) {
      this.editor.focus();
    }
  }
}

export default new EditorManager();
