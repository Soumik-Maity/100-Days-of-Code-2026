// ==========================================
// Questions Manager
// ==========================================

class QuestionsManager {
  constructor() {
    this.questionBank = [];
    this.questions = [];
  }

  /**
   * Load questions from JSON.
   */
  async load() {
    const response = await fetch("questions/questions.json");

    if (!response.ok) {
      throw new Error("Unable to load questions.json");
    }

    const data = await response.json();

    this.questionBank = data.questionBank;

    this.flattenQuestions();
  }

  /**
   * Flatten all sections into a single ordered array.
   */
  flattenQuestions() {
    this.questions = [];

    for (const section of this.questionBank) {
      for (const question of section.questions) {
        this.questions.push({
          ...question,
          section: section.section,
          icon: section.icon,
          color: section.color,
        });
      }
    }
  }

  /**
   * Get all questions.
   */
  getAllQuestions() {
    return this.questions;
  }

  /**
   * Get question by ID.
   *
   * @param {number} id
   * @returns {Object|null}
   */
  getQuestionById(id) {
    return this.questions.find((question) => question.id === id) || null;
  }

  /**
   * Get today's questions.
   *
   * Days 1–50  : 2 questions/day
   * Days 51–100: 1 question/day
   *
   * @param {number} day
   * @returns {Array}
   */
  getTodaysQuestions(day) {
    if (day < 1 || day > 100) {
      return [];
    }

    if (day <= 50) {
      const startIndex = (day - 1) * 2;

      return this.questions.slice(startIndex, startIndex + 2);
    }

    const questionIndex = 100 + (day - 51);

    return this.questions[questionIndex] ? [this.questions[questionIndex]] : [];
  }

  /**
   * Get all questions available before today.
   *
   * @param {number} day
   * @returns {Array}
   */
  getPreviousQuestions(day) {
    if (day <= 1) {
      return [];
    }

    let releasedQuestions;

    if (day <= 50) {
      releasedQuestions = (day - 1) * 2;
    } else {
      releasedQuestions = 100 + (day - 50);
    }

    return this.questions.slice(0, releasedQuestions);
  }

  /**
   * Total questions.
   */
  getTotalQuestions() {
    return this.questions.length;
  }

  /**
   * Total program days.
   */
  getTotalDays() {
    return 100;
  }
  getNextQuestion(id) {
    const index = this.questions.findIndex((question) => question.id === id);

    return this.questions[index + 1] || null;
  }

  getPreviousQuestion(id) {
    const index = this.questions.findIndex((question) => question.id === id);

    return this.questions[index - 1] || null;
  }
  /**
   * Returns the highest unlocked question ID.
   */
  getLastUnlockedQuestionId(day) {
    const todaysQuestions = this.getTodaysQuestions(day);

    if (todaysQuestions.length === 0) {
      return 0;
    }

    return todaysQuestions[todaysQuestions.length - 1].id;
  }
  getQuestionDay(questionId) {
    return Math.ceil(questionId / 2);
  }
  /**
   * Returns every question with its day.
   *
   * @returns {Array}
   */
  getAllQuestions() {
    const result = [];

    this.questionBank.forEach((section) => {
      section.questions.forEach((question) => {
        result.push({
          id: question.id,
          day: this.getQuestionDay(question.id),
          section: section.section,
          text: question.text,
        });
      });
    });

    return result.sort((a, b) => a.id - b.id);
  }
}

export default new QuestionsManager();
