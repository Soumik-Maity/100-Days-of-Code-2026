// ==========================================
// Features Modal Controller
// ==========================================

class Features {
  constructor() {
    this.initialized = false;
    this.overlay = document.getElementById("features-overlay");
    this.modal = document.getElementById("features-modal");
    this.content = document.getElementById("features-content");

    this.openButton = document.getElementById("features-button");
    this.closeButton = document.getElementById("features-close");
  }

  /**
   * Initialize Features Modal.
   */
  initialize() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    // Get DOM elements
    this.overlay = document.getElementById("features-overlay");
    this.modal = document.getElementById("features-modal");
    this.content = document.getElementById("features-content");

    this.openButton = document.getElementById("features-button");
    this.closeButton = document.getElementById("features-close");

    this.render();

    if (this.openButton) {
      this.openButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.open();
      });
    }

    if (this.closeButton) {
      this.closeButton.addEventListener("click", () => {
        this.close();
      });
    }

    if (this.overlay) {
      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.overlay && !this.overlay.hidden) {
        this.close();
      }
    });
  }
  /**
   * Open Features Modal.
   */
  open() {
    this.overlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  /**
   * Close Features Modal.
   */
  close() {
    this.overlay.hidden = true;
    document.body.style.overflow = "";
  }

  /**
   * Render Features.
   */
  render() {
    this.content.innerHTML = `
    
    <div class="feature-grid">

      <div class="feature-card">
        <h3>💻 Coding Workspace</h3>

        <ul>
          <li>Monaco Code Editor</li>
          <li>Version History</li>
          <li>Adjustable Editor Font Size</li>
          <li>Light & Dark Theme</li>
          <li>Session Timer</li>
          <li>Reset to Default Template</li>
        </ul>
      </div>

      <div class="feature-card">
        <h3>📚 Learning Experience</h3>

        <ul>
          <li>Structured 100-Day Coding Curriculum</li>
          <li>Daily Programming Challenges</li>
          <li>Revision Dashboard</li>
          <li>Progress Tracking</li>
          <li>Instructor Notes (where available)</li>
          <li>Sample Test Cases</li>
        </ul>
      </div>

      <div class="feature-card">
        <h3>🛡 Academic Integrity</h3>

        <ul>
          <li>Copy & Paste Restrictions</li>
          <li>Disabled Context Menu</li>
          <li>Disabled Drag & Drop</li>
          <li>Manual Coding Encouraged</li>
        </ul>
      </div>

      <div class="feature-card">
        <h3>💾 Local First</h3>

        <ul>
          <li>Local Workspace Storage</li>
          <li>Instant Code Saving</li>
          <li>Offline Friendly</li>
          <li>No Login Required</li>
        </ul>
      </div>

      <div class="feature-card feature-coming-soon">
        <h3>🚀 Upcoming Features</h3>

        <ul>
          <li>▶ Compile & Run Programs</li>
          <li>✔ Automatic Test Case Validation</li>
          <li>📊 Performance Analytics</li>
          <li>🏅 Badges & Achievements</li>
        </ul>
      </div>

    </div>

    <div class="feature-footer">
      Built exclusively for the
      <strong>UPES 100 Days of Code Initiative</strong>

      <br>

      Version 1.0

      <br><br>

      <span class="feature-copyright">
        © Soumik Maity
      </span>
    </div>
    `;
  }
}

export default new Features();
