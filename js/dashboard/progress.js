// ==========================================
// Dashboard Progress Manager
// ==========================================

import QuestionsManager from "../questions/questions.js";
import Calendar from "../utils/calendar.js";

class ProgressManager {
  constructor() {
    this.container = document.getElementById("dashboard-progress");
  }

  /**
   * Render Progress Section
   *
   * @param {Object} progress
   */
  render(progress) {
    if (!this.container) return;

    if (!progress) {
      this.container.innerHTML = "";
      return;
    }

    const totalQuestions = QuestionsManager.getAllQuestions().length;

    const solvedQuestions = progress.questionsSolved
      ? progress.questionsSolved.length
      : 0;

    const completion = Math.round((solvedQuestions / totalQuestions) * 100);

    const currentStreak = this.calculateCurrentStreak(progress);

    const longestStreak = this.calculateLongestStreak(progress);

    this.container.innerHTML = `
      <div class="progress-grid">

        <div class="progress-card">
          <div class="progress-title"><svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c4 0 7-2.5 7-6.5C19 10 15 8 15 4c-2 1.5-3 4-3 6-2-1-3-3-3-5-3 2-4 5-4 9.5C5 18.5 8 21 12 21Z"/></svg> Current Streak</div>
          <div class="progress-value">${currentStreak} Day${
      currentStreak !== 1 ? "s" : ""
    }</div>
        </div>

        <div class="progress-card">
          <div class="progress-title"><svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v4a5 5 0 0 1-5 5 5 5 0 0 1-5-5V4Z"/><path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3"/><path d="M12 13v3m-3 4h6m-3-4v4"/></svg> Longest Streak</div>
          <div class="progress-value">${longestStreak} Day${
      longestStreak !== 1 ? "s" : ""
    }</div>
        </div>

        <div class="progress-card">
          <div class="progress-title"><svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V9m5 10V5m5 14v-7m5 7V4"/></svg> Progress</div>

          <div class="progress-value">
            ${solvedQuestions} / ${totalQuestions}
          </div>

          <div class="progress-bar">
            <div
              class="progress-fill"
              style="width:${completion}%"
            ></div>
          </div>

          <div class="progress-percent">
            ${completion}% Completed
          </div>
        </div>

      </div>

      <div class="heatmap-section">
        <h3>100 Days Progress</h3>

        <div class="heatmap-grid">
          ${this.renderHeatmap(progress)}
        </div>
      </div>
    `;
  }

  /**
   * Render Heatmap
   */
  renderHeatmap(progress) {
    let html = "";

    for (let day = 1; day <= 100; day++) {
      const questions = QuestionsManager.getTodaysQuestions(day);

      if (questions.length === 0) {
        html += `<div class="heat-cell locked"></div>`;
        continue;
      }

      const solved = questions.filter((q) =>
        progress.questionsSolved.includes(q.id)
      ).length;

      let cls = "locked";

      if (solved === questions.length) {
        cls = "completed";
      } else if (solved > 0) {
        cls = "partial";
      }

      html += `
        <div
          class="heat-cell ${cls}"
          title="Day ${day}"
        ></div>
      `;
    }

    return html;
  }

  /**
   * Current streak
   */
  calculateCurrentStreak(progress) {
    const today = Calendar.getCurrentDay();

    let streak = 0;

    for (let day = today; day >= 1; day--) {
      const questions = QuestionsManager.getTodaysQuestions(day);

      if (questions.every((q) => progress.questionsSolved.includes(q.id))) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Longest streak
   */
  calculateLongestStreak(progress) {
    let longest = 0;
    let current = 0;

    for (let day = 1; day <= 100; day++) {
      const questions = QuestionsManager.getTodaysQuestions(day);

      if (questions.length === 0) continue;

      if (questions.every((q) => progress.questionsSolved.includes(q.id))) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 0;
      }
    }

    return longest;
  }
}

export default new ProgressManager();
