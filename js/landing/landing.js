// ==========================================
// Landing Manager
// ==========================================
import instructionsManager from "../instructions/instructions.js";
class LandingManager {
  constructor() {
    this.landingView = document.getElementById("landing-view");
    this.appRoot = document.getElementById("app");
    this.startButtons = [
      document.getElementById("start-button"),
      document.getElementById("start-button-main"),
    ].filter(Boolean);
    this.instructionsButton = document.querySelector(
      ".landing-secondary-button",
    );
  }

  /**
   * Register events.
   *
   * @param {Function} onStart Called after the landing page is dismissed.
   */
  initialize(onStart) {
    this.startButtons.forEach((button) => {
      button.addEventListener("click", () => this.enter(onStart));
    });
    this.instructionsButton?.addEventListener("click", () => {
      instructionsManager.show();
    });
    console.log(this.instructionsButton);
  }

  /**
   * Hide the landing page and reveal the application.
   *
   * @param {Function} onStart
   */
  enter(onStart) {
    if (this.landingView) {
      this.landingView.hidden = true;
    }

    if (this.appRoot) {
      this.appRoot.hidden = false;
    }

    if (typeof onStart === "function") {
      onStart();
    }
  }
}

export default new LandingManager();
