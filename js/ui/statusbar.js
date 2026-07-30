// ==========================================
// Status Bar Controller
// ==========================================

class StatusBar {
  constructor() {
    this.dayElement = document.getElementById("status-day");
    this.questionElement = document.getElementById("status-question");
    this.saveElement = document.getElementById("status-save");
    this.themeElement = document.getElementById("status-theme");
  }

  /**
   * Update current day.
   * @param {number|string} day
   */
  setDay(day) {
    this.dayElement.textContent = `Day: ${day}`;
  }

  /**
   * Update current question.
   * @param {string} question
   */
  setQuestion(question) {
    this.questionElement.textContent = question;
  }

  /**
   * Update save/workspace status.
   * @param {string} status
   */
  setSaveStatus(status) {
    this.saveElement.textContent = status;
  }

  /**
   * Update theme indicator.
   * @param {string} theme
   */
  setTheme(theme) {
    this.themeElement.textContent = theme;
  }
}

export default new StatusBar();
