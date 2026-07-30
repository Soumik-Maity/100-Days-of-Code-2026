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
          <div class="progress-title">🔥 Current Streak</div>
          <div class="progress-value">${currentStreak} Day${
      currentStreak !== 1 ? "s" : ""
    }</div>
        </div>

        <div class="progress-card">
          <div class="progress-title">🏆 Longest Streak</div>
          <div class="progress-value">${longestStreak} Day${
      longestStreak !== 1 ? "s" : ""
    }</div>
        </div>

        <div class="progress-card">
          <div class="progress-title">📈 Progress</div>

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
