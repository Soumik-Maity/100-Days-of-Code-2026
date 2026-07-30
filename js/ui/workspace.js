// ==========================================
// Workspace UI
// ==========================================

class Workspace {
  constructor() {
    this.questionId = document.getElementById("workspace-question-id");
    this.questionText = document.getElementById("question-text");
    this.testCases = document.getElementById("question-testcases");
    this.notes = document.getElementById("question-notes");
  }

  /**
   * Display a question in the workspace.
   * @param {Object} question
   */
  showQuestion(question) {
    // Header
    this.questionId.textContent = `Question ${question.id}`;

    // Problem
    this.questionText.textContent = question.text;

    // Test Cases
    this.testCases.innerHTML = "";

    if (question.testCases && question.testCases.length > 0) {
      question.testCases.forEach((testCase, index) => {
        const card = document.createElement("div");
        card.className = "testcase-card";

        card.innerHTML = `
                <h4>Example ${index + 1}</h4>

                <div class="testcase-section">
                    <strong>Input</strong>
                    <pre>${testCase.input}</pre>
                </div>

                <div class="testcase-section">
                    <strong>Output</strong>
                    <pre>${testCase.output}</pre>
                </div>
            `;

        this.testCases.appendChild(card);
      });
    }

    // Notes
    const notesSection = document.getElementById("notes-section");
    const notesElement = document.getElementById("question-notes");

    notesSection.hidden = true;
    notesElement.innerHTML = "";

    if (question.notes) {
      switch (question.notes.type) {
        case "text":
          notesElement.textContent = question.notes.value;
          notesSection.hidden = false;
          break;
      }
    }
  }

  /**
   * Render visible test cases.
   * @param {Array} testCases
   */
  renderTestCases(testCases) {
    this.testCases.innerHTML = "";

    if (testCases.length === 0) {
      this.testCases.innerHTML = "<p>No test cases available.</p>";

      return;
    }

    testCases.forEach((testCase) => {
      const card = document.createElement("div");

      card.className = "testcase-card";

      card.innerHTML = `
                <strong>Input</strong>
                <pre>${testCase.input}</pre>

                <strong>Output</strong>
                <pre>${testCase.output}</pre>
            `;

      this.testCases.appendChild(card);
    });
  }

  /**
   * Render notes.
   * @param {string} notes
   */
  renderNotes(notes) {
    if (!notes || notes.trim() === "") {
      this.notes.textContent = "No notes available.";

      return;
    }

    this.notes.textContent = notes;
  }
}

export default new Workspace();
