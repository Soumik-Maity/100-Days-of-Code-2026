// ==========================================
// UPES 100 Days of Code
// Application Entry
// ==========================================

import WorkspaceManager from "./workspace/workspace.js";
import QuestionsManager from "./questions/questions.js";
import StatusBar from "./ui/statusbar.js";
import UIManager from "./ui/ui.js";
import Workspace from "./ui/workspace.js";
import EditorManager from "./editor/editor.js";
import RevisionManager from "./revision/revision.js";
import Calendar from "./utils/calendar.js";
import HistoryManager from "./history/history.js";
import ProgressManager from "./dashboard/progress.js";
import ThemeManager from "./theme/theme.js";
import InstructionsManager from "./instructions/instructions.js";

class App {
  constructor() {
    this.currentDay = Calendar.getCurrentDay();
    this.currentQuestionId = null;

    // Buttons
    this.workspaceButton = document.getElementById("workspace-button");
    this.previousButton = document.getElementById("previous-question");
    this.nextButton = document.getElementById("next-question");
    this.saveButton = document.getElementById("save-button");

    // Views
    this.welcomeView = document.getElementById("welcome-view");
    this.dashboardView = document.getElementById("dashboard-view");
    this.workspaceView = document.getElementById("workspace-view");

    //Revision
    this.revisionButton = document.getElementById("revision-nav");

    //Navbar
    this.dashboardButton = document.getElementById("dashboard-nav");
    this.workspaceNavButton = document.getElementById("workspace-nav");
    this.revisionButton = document.getElementById("revision-nav");

    //History
    this.historyButton = document.getElementById("history-button");

    //Instruction
    this.instructionsButton = document.getElementById("instructions-button");

    this.registerEvents();
    ThemeManager.initialize();
    this.initialize();
  }

  /**
   * Initialize application.
   */
  async initialize() {
    try {
      await QuestionsManager.load();
      const calendar = Calendar.getStatus();

      if (!calendar.started) {
        StatusBar.setSaveStatus("Course starts on 10 Aug 2026");
        return;
      }

      this.currentDay = calendar.day;

      if (calendar.weekend) {
        UIManager.setCurrentDay(this.currentDay);
        UIManager.setCurrentChapter("Weekend");

        UIManager.setTodayQuestions([], () => {});

        StatusBar.setDay(this.currentDay);
        StatusBar.setQuestion("Weekend");
        StatusBar.setSaveStatus("No new questions today");

        return;
      }

      const todaysQuestions = QuestionsManager.getTodaysQuestions(
        this.currentDay
      );

      UIManager.setCurrentDay(this.currentDay);

      if (todaysQuestions.length > 0) {
        UIManager.setCurrentChapter(todaysQuestions[0].section);
      }

      UIManager.setTodayQuestions(todaysQuestions, (questionId) =>
        this.openCodingWorkspace(questionId)
      );

      StatusBar.setDay(this.currentDay);
      StatusBar.setQuestion(this.getQuestionStatus(this.currentDay));
      StatusBar.setSaveStatus("Workspace Not Selected");
    } catch (error) {
      console.error(error);

      StatusBar.setSaveStatus("Failed to Load Questions");
    }
  }

  /**
   * Register events.
   */
  registerEvents() {
    this.dashboardButton.addEventListener("click", () => this.openDashboard());
    this.instructionsButton.addEventListener("click", () => {
      InstructionsManager.show();
    });
    this.historyButton.addEventListener("click", () => this.openHistory());

    this.workspaceNavButton.addEventListener("click", async () => {
      const calendar = Calendar.getStatus();

      if (!calendar.started) {
        StatusBar.setSaveStatus("Course starts on 10 Aug 2026");
        return;
      }

      if (this.currentQuestionId) {
        await this.openCodingWorkspace(this.currentQuestionId);
        return;
      }

      const progress = await WorkspaceManager.getProgress();

      if (progress.lastOpenedQuestion) {
        await this.openCodingWorkspace(progress.lastOpenedQuestion);
      }
    });

    this.workspaceButton.addEventListener("click", () =>
      this.selectWorkspace()
    );

    this.previousButton.addEventListener("click", () =>
      this.openPreviousQuestion()
    );

    this.nextButton.addEventListener("click", () => this.openNextQuestion());

    this.saveButton.addEventListener("click", () => this.saveCurrentSolution());

    this.revisionButton.addEventListener("click", () => this.openRevision());

    // ==========================================
    // Disable Right Click
    // ==========================================

    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    // ==========================================
    // Disable Paste
    // ==========================================

    document.addEventListener("paste", (event) => {
      event.preventDefault();
    });

    // ==========================================
    // Disable Drag & Drop
    // ==========================================

    document.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    document.addEventListener("drop", (event) => {
      event.preventDefault();
    });
  }
  /**
   * Select workspace.
   */
  async selectWorkspace() {
    StatusBar.setSaveStatus("Opening Workspace...");

    const success = await WorkspaceManager.selectWorkspace();

    if (!success) {
      StatusBar.setSaveStatus("Workspace Not Selected");
      return;
    }

    this.welcomeView.hidden = true;
    this.dashboardView.hidden = false;
    document
      .querySelectorAll(".nav-item")
      .forEach((btn) => btn.classList.remove("active"));

    document.getElementById("dashboard-nav").classList.add("active");
    const calendar = Calendar.getStatus();

    if (calendar.started) {
      await this.refreshDashboard();
    } else {
      UIManager.setCurrentDay(0);
      UIManager.setCurrentChapter("Course starts on 10 Aug 2026");
      UIManager.setTodayQuestions([], () => {});

      StatusBar.setDay("--");
      StatusBar.setQuestion("--");
      StatusBar.setSaveStatus("Course starts on 10 Aug 2026");
    }
    StatusBar.setSaveStatus("Workspace Ready");
  }

  /**
   * Open coding workspace.
   *
   * @param {number} questionId
   */
  async openCodingWorkspace(questionId) {
    const calendar = Calendar.getStatus();

    if (!calendar.started) {
      StatusBar.setSaveStatus("Course starts on 10 Aug 2026");
      return;
    }
    const question = QuestionsManager.getQuestionById(questionId);

    if (!question) {
      return;
    }

    this.currentQuestionId = question.id;
    document
      .querySelectorAll(".nav-item")
      .forEach((btn) => btn.classList.remove("active"));

    document.getElementById("workspace-nav").classList.add("active");
    this.dashboardView.hidden = true;
    document.getElementById("revision-view").hidden = true;
    this.workspaceView.hidden = false;
    document.getElementById("layout").classList.add("sidebar-collapsed");
    Workspace.showQuestion(question);

    if (!EditorManager.editor) {
      EditorManager.initialize();

      const interval = setInterval(async () => {
        if (EditorManager.editor) {
          clearInterval(interval);

          await this.loadCurrentSolution(question);
        }
      }, 50);
    } else {
      await this.loadCurrentSolution(question);
    }

    StatusBar.setQuestion(`Question ${question.id}`);
  }

  /**
   * Load saved solution.
   *
   * @param {Object} question
   */
  async loadCurrentSolution(question) {
    const day = QuestionsManager.getQuestionDay(question.id);

    const code = await WorkspaceManager.loadSolution(day, question.id);

    if (code !== null && code.trim() !== "") {
      EditorManager.setCode(code);

      const status = document.getElementById("editor-save-status");

      status.textContent = "Saved";

      status.classList.remove("unsaved");

      status.classList.add("saved");
    } else {
      EditorManager.setCode(EditorManager.defaultTemplate());

      document.getElementById("editor-save-status").textContent = "Unsaved";
    }

    document.getElementById("editor-file-name").textContent = `Q${String(
      question.id
    ).padStart(3, "0")}.c`;
  }
  /**
   * Save current solution.
   */
  async saveCurrentSolution() {
    if (!this.currentQuestionId) {
      return;
    }

    const question = QuestionsManager.getQuestionById(this.currentQuestionId);

    if (!question) {
      return;
    }

    const day = QuestionsManager.getQuestionDay(question.id);

    try {
      const code = EditorManager.getCode();

      await WorkspaceManager.saveSolution(day, question.id, code);

      await WorkspaceManager.saveHistory(day, question.id, code);

      await this.updateProgress(question.id);

      await this.refreshDashboard();

      StatusBar.setSaveStatus("Saved");

      document.getElementById("editor-save-status").textContent = "Saved";
    } catch (error) {
      console.error(error);

      StatusBar.setSaveStatus("Save Failed");

      document.getElementById("editor-save-status").textContent = "Save Failed";
    }
  }

  /**
   * Open previous question.
   */
  openPreviousQuestion() {
    const question = QuestionsManager.getPreviousQuestion(
      this.currentQuestionId
    );

    if (!question) {
      return;
    }

    this.openCodingWorkspace(question.id);
  }

  /**
   * Open next question.
   */
  openNextQuestion() {
    const question = QuestionsManager.getNextQuestion(this.currentQuestionId);

    if (!question) {
      return;
    }

    const lastUnlocked = QuestionsManager.getLastUnlockedQuestionId(
      this.currentDay
    );

    if (question.id > lastUnlocked) {
      return;
    }

    this.openCodingWorkspace(question.id);
  }

  /**
   * Returns question status for the status bar.
   *
   * @param {number} day
   * @returns {string}
   */
  getQuestionStatus(day) {
    const todaysQuestions = QuestionsManager.getTodaysQuestions(day);

    if (todaysQuestions.length === 2) {
      return `Questions ${todaysQuestions[0].id}-${todaysQuestions[1].id}`;
    }

    if (todaysQuestions.length === 1) {
      return `Question ${todaysQuestions[0].id}`;
    }

    return "No Questions";
  }
  async updateProgress(questionId) {
    const progress = await WorkspaceManager.getProgress();

    if (!progress.questionsSolved.includes(questionId)) {
      progress.questionsSolved.push(questionId);
    }

    progress.lastOpenedQuestion = questionId;
    progress.currentQuestion = questionId;
    progress.currentDay = QuestionsManager.getQuestionDay(questionId);

    await WorkspaceManager.saveProgress(progress);
  }
  async refreshDashboard() {
    const calendar = Calendar.getStatus();

    if (!calendar.started) {
      UIManager.setCurrentDay(0);
      UIManager.setCurrentChapter("Course starts on 10 Aug 2026");
      UIManager.setTodayQuestions([], () => {});
      return;
    }

    if (calendar.weekend) {
      UIManager.setCurrentDay(calendar.day);
      UIManager.setCurrentChapter("Weekend");
      UIManager.setTodayQuestions([], () => {});

      StatusBar.setDay(calendar.day);
      StatusBar.setQuestion("Weekend");
      StatusBar.setSaveStatus("No new questions today");

      return;
    }

    const currentDay = calendar.day;

    const progress = await WorkspaceManager.getProgress();

    const todaysQuestions = QuestionsManager.getTodaysQuestions(currentDay);

    UIManager.setCurrentDay(currentDay);

    if (todaysQuestions.length > 0) {
      UIManager.setCurrentChapter(todaysQuestions[0].section);
    } else {
      UIManager.setCurrentChapter("No Questions");
    }

    UIManager.setTodayQuestions(todaysQuestions, progress, (questionId) =>
      this.openCodingWorkspace(questionId)
    );
    ProgressManager.render(progress);
    StatusBar.setDay(currentDay);
    StatusBar.setQuestion(this.getQuestionStatus(currentDay));
  }
  async openRevision() {
    const calendar = Calendar.getStatus();

    if (!calendar.started) {
      StatusBar.setSaveStatus("Course starts on 10 Aug 2026");
      return;
    }
    const progress = await WorkspaceManager.getProgress();

    this.dashboardView.hidden = true;
    this.workspaceView.hidden = true;

    document.getElementById("revision-view").hidden = false;
    document.getElementById("layout").classList.remove("sidebar-collapsed");
    document
      .querySelectorAll(".nav-item")
      .forEach((btn) => btn.classList.remove("active"));

    document.getElementById("revision-nav").classList.add("active");
    RevisionManager.render(progress, (questionId) =>
      this.openCodingWorkspace(questionId)
    );
  }
  async openDashboard() {
    const calendar = Calendar.getStatus();

    this.workspaceView.hidden = true;
    document.getElementById("revision-view").hidden = true;
    this.dashboardView.hidden = false;
    document.getElementById("layout").classList.remove("sidebar-collapsed");
    document
      .querySelectorAll(".nav-item")
      .forEach((btn) => btn.classList.remove("active"));

    document.getElementById("dashboard-nav").classList.add("active");

    if (!calendar.started) {
      UIManager.setCurrentDay(0);
      UIManager.setCurrentChapter("Course starts on 10 Aug 2026");
      UIManager.setTodayQuestions([], () => {});

      StatusBar.setDay("--");
      StatusBar.setQuestion("--");
      StatusBar.setSaveStatus("Course starts on 10 Aug 2026");
      return;
    }

    await this.refreshDashboard();
  }
  async openHistory() {
    if (!this.currentQuestionId) {
      return;
    }

    const question = QuestionsManager.getQuestionById(this.currentQuestionId);

    if (!question) {
      return;
    }

    const day = QuestionsManager.getQuestionDay(question.id);

    await HistoryManager.show(day, question.id);
  }
}

new App();
