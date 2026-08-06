// ==========================================
// Dashboard UI Manager
// ==========================================

import { icon } from "../utils/icons.js";

class UIManager {
  constructor() {
    this.currentDayElement = document.getElementById("current-day");
    this.currentChapterElement = document.getElementById("current-chapter");
    this.todayQuestionsContainer = document.getElementById("today-questions");
  }

  /**
   * Update current day.
   *
   * @param {number} day
   */
  setCurrentDay(day) {
    this.currentDayElement.textContent = `Day ${day}`;
  }

  /**
   * Update current chapter.
   *
   * @param {string} chapter
   */
  setCurrentChapter(chapter) {
    this.currentChapterElement.textContent = chapter;
  }

  /**
   * Render today's questions.
   *
   * @param {Array} questions
   * @param {Object} progress
   * @param {Function} onOpen
   */
  setTodayQuestions(questions, progress, onOpen) {
    this.todayQuestionsContainer.innerHTML = "";

    if (!questions || questions.length === 0) {
      this.todayQuestionsContainer.innerHTML = `
          <div class="dashboard-empty">
            No questions available for today.
          </div>
        `;
      return;
    }

    questions.forEach((question) => {
      const solved =
        progress &&
        progress.questionsSolved &&
        progress.questionsSolved.includes(question.id);

      const card = document.createElement("div");

      card.className = solved ? "question-card solved" : "question-card";

      card.innerHTML = `
          <div class="question-card-header">
  
            <span class="question-number">
              Question ${question.id}
            </span>
  
            <span class="question-status ${solved ? "solved" : "pending"}">
              ${solved ? `${icon("check")} Solved` : "Not Started"}
            </span>
  
          </div>
  
          <p class="question-title">
            ${question.text}
          </p>
  
          <div class="question-card-footer">
  
            <button class="question-start-button">
              ${solved ? `${icon("refresh")} Review` : `${icon("play")} Start Coding`}
            </button>
  
          </div>
        `;

      card
        .querySelector(".question-start-button")
        .addEventListener("click", () => {
          onOpen(question.id);
        });

      this.todayQuestionsContainer.appendChild(card);
    });
  }
}

export default new UIManager();
