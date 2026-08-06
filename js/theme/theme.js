// ==========================================
// Theme Manager
// ==========================================

import StatusBar from "../ui/statusbar.js";
import { icon } from "../utils/icons.js";

class ThemeManager {
  constructor() {
    this.toggle = document.getElementById("theme-toggle");
  }

  /**
   * Initialize Theme
   */
  initialize() {
    const savedTheme = localStorage.getItem("theme") || "dark";

    this.setTheme(savedTheme);

    if (this.toggle) {
      this.toggle.checked = savedTheme === "light";

      this.toggle.addEventListener("change", () => {
        const theme = this.toggle.checked ? "light" : "dark";
        this.setTheme(theme);
      });
    }
  }

  /**
   * Apply Theme
   *
   * @param {string} theme
   */
  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("theme", theme);

    StatusBar.setTheme(
      theme === "light"
        ? `${icon("sun", "status-icon")} Light`
        : `${icon("moon", "status-icon")} Dark`
    );
  }

  /**
   * Get current theme
   */
  getTheme() {
    return document.documentElement.getAttribute("data-theme");
  }

  /**
   * Toggle programmatically
   */
  toggleTheme() {
    const current = this.getTheme();

    this.setTheme(current === "dark" ? "light" : "dark");

    if (this.toggle) {
      this.toggle.checked = this.getTheme() === "light";
    }
  }
}

export default new ThemeManager();
