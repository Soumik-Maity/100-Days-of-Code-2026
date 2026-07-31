// ==========================================
// Revision Manager
// ==========================================
import Calendar from "../utils/calendar.js";
import QuestionsManager from "../questions/questions.js";

class RevisionManager {
  constructor() {
    this.container = document.getElementById("revision-list");
  }

  /**
   * Render Revision List
   *
   * @param {Object} progress
   * @param {Function} onOpenQuestion
   */
  render(progress, onOpenQuestion) {
    this.container.innerHTML = "";

    const currentDay = Calendar.getCurrentDay();

    const questions = QuestionsManager.getAllQuestions().filter(
      (q) => q.day <= currentDay
    );

    if (!questions || questions.length === 0) {
      this.container.innerHTML = `
        <div class="revision-empty">
          No questions found.
        </div>
      `;
      return;
    }

    // -----------------------------
    // Header
    // -----------------------------
    const header = document.createElement("div");
    header.className = "revision-row revision-header";

    header.innerHTML = `
      <div>Day</div>
      <div>Topic</div>
      <div>Question</div>
      <div>Status</div>
      <div>Action</div>
    `;

    this.container.appendChild(header);

    // -----------------------------
    // Rows
    // -----------------------------
    questions.forEach((question) => {
      const solved =
        progress &&
        progress.questionsSolved &&
        progress.questionsSolved.includes(question.id);

      const row = document.createElement("div");
      row.className = "revision-row";

      row.innerHTML = `
        <div class="revision-day">
          Day ${question.day}
        </div>

        <div class="revision-topic">
          ${question.section}
        </div>

        <div class="revision-question">
          <strong>Question ${question.id}</strong>
          <span>${question.text}</span>
        </div>

        <div>
          <span class="revision-status ${solved ? "solved" : "pending"}">
            ${solved ? "Solved" : "Not Started"}
          </span>
        </div>

        <div>
          <button class="revision-open-button">
            ${solved ? "Review" : "Start"}
          </button>
        </div>
      `;

      row
        .querySelector(".revision-open-button")
        .addEventListener("click", () => {
          onOpenQuestion(question.id);
        });

      this.container.appendChild(row);
    });
  }
}

export default new RevisionManager();
