// ==========================================
// Instructions Manager
// ==========================================

class InstructionsManager {
  constructor() {
    this.overlay = document.getElementById("instructions-overlay");
    this.modal = document.getElementById("instructions-modal");
    this.content = document.getElementById("instructions-content");
    this.closeButton = document.getElementById("instructions-close");

    this.registerEvents();
  }

  /**
   * Register events.
   */
  registerEvents() {
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

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.overlay && !this.overlay.hidden) {
        this.hide();
      }
    });
  }

  /**
   * Show Instructions
   */
  show() {
    if (!this.overlay) return;

    this.content.innerHTML = `
        <section class="instruction-section">
          <h3>👋 Welcome</h3>
          <p>
            Welcome to the <strong>UPES 100 Days of Code</strong> platform.
            This application is designed to help you build programming skills
            through regular practice. Your progress and solutions are stored
            locally on your computer.
          </p>
        </section>
  
        <section class="instruction-section">
          <h3>🚀 Getting Started</h3>
          <ul>
            <li>Select a workspace folder when you launch the application.</li>
            <li>This folder stores your code, history and progress.</li>
            <li>Do not rename or delete the workspace during the course.</li>
          </ul>
        </section>
  
        <section class="instruction-section">
          <h3>💻 Coding Workspace</h3>
          <ul>
            <li>Each question includes a problem statement and sample test cases.</li>
            <li>Write your solution inside the editor provided.</li>
            <li>Save regularly while working.</li>
          </ul>
        </section>
  
        <section class="instruction-section">
          <h3>💾 Saving Your Work</h3>
          <ul>
            <li>Every save updates your latest solution.</li>
            <li>A timestamped history snapshot is also created automatically.</li>
            <li>You can restore any previous attempt using the History button.</li>
          </ul>
        </section>
  
        <section class="instruction-section">
          <h3>📚 Revision</h3>
          <ul>
            <li>Questions from previous days remain available.</li>
            <li>If you miss a day's practice, complete it later from the Revision section.</li>
          </ul>
        </section>
  
        <section class="instruction-section">
          <h3>📈 Progress Tracking</h3>
          <ul>
            <li>Dashboard displays your overall completion.</li>
            <li>Current and longest streaks are calculated automatically.</li>
            <li>The 100-day heatmap reflects your daily progress.</li>
          </ul>
        </section>
  
        <section class="instruction-section">
          <h3>⌨️ Coding Policy</h3>
          <ul>
            <li>Students are expected to type their own solutions.</li>
            <li>Clipboard paste inside the editor is disabled.</li>
            <li>All work should be your own.</li>
          </ul>
        </section>
  
        <section class="instruction-section">
          <h3>💡 Best Practices</h3>
          <ul>
            <li>Save frequently.</li>
            <li>Attempt every problem independently.</li>
            <li>Use Revision to strengthen weaker topics.</li>
            <li>Focus on understanding logic rather than memorising programs.</li>
          </ul>
        </section>
  
        <section class="instruction-section">
          <h3>🎯 Goal</h3>
          <p>
            The objective of this platform is not merely to complete 100
            questions, but to develop consistency, logical thinking and
            confidence in programming through continuous practice.
          </p>
        </section>
  
        <div class="instruction-footer">
  UPES School of Computer Science<br>
  100 Days of Code Platform • Version 1.0<br><br>
  &copy; Soumik Maity
</div>
      `;

    this.overlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  /**
   * Hide Instructions
   */
  hide() {
    if (!this.overlay) return;

    this.overlay.hidden = true;
    document.body.style.overflow = "";
  }
}

export default new InstructionsManager();
