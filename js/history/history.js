// ==========================================
// History Manager
// ==========================================

import WorkspaceManager from "../workspace/workspace.js";
import EditorManager from "../editor/editor.js";

class HistoryManager {
  constructor() {
    this.overlay = document.getElementById("history-overlay");
    this.modal = document.getElementById("history-modal");
    this.list = document.getElementById("history-list");
    this.closeButton = document.getElementById("history-close");

    this.bindEvents();
  }

  bindEvents() {
    if (this.closeButton) {
      this.closeButton.addEventListener("click", () => this.hide());
    }

    if (this.overlay) {
      this.overlay.addEventListener("click", (event) => {
        if (event.target === this.overlay) {
          this.hide();
        }
      });
    }
  }

  async show(day, questionId) {
    console.log("History Day:", day);
    console.log("History Question:", questionId);
    const files = await WorkspaceManager.getHistory(day, questionId);
    console.log(files);
    this.render(files);

    this.overlay.hidden = false;
  }

  hide() {
    this.overlay.hidden = true;
    this.list.innerHTML = "";
  }

  render(files) {
    this.list.innerHTML = "";

    if (!files || files.length === 0) {
      this.list.innerHTML = `
        <div class="history-empty">
          No history available.
        </div>
      `;
      return;
    }

    files.forEach((file) => {
      const row = document.createElement("div");
      row.className = "history-row";

      row.innerHTML = `
        <span class="history-name">
          ${this.formatTimestamp(file.name)}
        </span>

        <button class="history-open">
          Open
        </button>
      `;

      row.querySelector(".history-open").addEventListener("click", async () => {
        const code = await WorkspaceManager.loadHistoryFile(file.handle);

        EditorManager.setCode(code);

        document.getElementById("editor-save-status").textContent =
          "History Preview";

        this.hide();
      });

      this.list.appendChild(row);
    });
  }

  formatTimestamp(fileName) {
    const match = fileName.match(
      /Q\d+_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/
    );

    if (!match) {
      return fileName;
    }

    const [, year, month, day, hour, minute, second] = match;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return `${day} ${
      months[Number(month) - 1]
    } ${year} ${hour}:${minute}:${second}`;
  }
}

export default new HistoryManager();
