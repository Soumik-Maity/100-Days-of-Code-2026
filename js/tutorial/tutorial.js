// ==========================================
// Tutorial Modal Controller
// ==========================================
const VIDEOS = {
  platform:
    "https://drive.google.com/file/d/1Z5QTS3JFSwYpkBDyfdS95ZdsF8qfU0LM/preview",

  github: "", // Add second video later
};
class Tutorial {
  constructor() {
    this.initialized = false;

    this.overlay = document.getElementById("tutorial-overlay");
    this.modal = document.getElementById("tutorial-modal");
    this.content = document.getElementById("tutorial-content");

    this.openButton = document.getElementById("tutorial-button");
    this.closeButton = document.getElementById("tutorial-close");
    this.videoOverlay = document.getElementById("video-overlay");
    this.videoPlayer = document.getElementById("tutorial-player");
    this.videoClose = document.getElementById("video-close");
  }

  /**
   * Initialize Tutorial Modal.
   */
  initialize() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    // Get DOM elements
    this.overlay = document.getElementById("tutorial-overlay");
    this.modal = document.getElementById("tutorial-modal");
    this.content = document.getElementById("tutorial-content");

    this.openButton = document.getElementById("tutorial-button");
    this.closeButton = document.getElementById("tutorial-close");

    this.render();
    this.content.addEventListener("click", (e) => {
      const button = e.target.closest(".watch-button");

      if (!button) return;

      const video = button.dataset.video;

      this.playVideo(VIDEOS[video]);
    });
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

    if (this.videoClose) {
      this.videoClose.addEventListener("click", () => {
        this.closeVideo();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.overlay && !this.overlay.hidden) {
        this.close();
      }
    });
  }

  /**
   * Open Tutorial Modal.
   */
  open() {
    this.overlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  /**
   * Close Tutorial Modal.
   */
  close() {
    this.overlay.hidden = true;
    document.body.style.overflow = "";
  }

  /**
   * Render Tutorials.
   */
  render() {
    this.content.innerHTML = `
    
      <div class="tutorial-list">

        <!-- Tutorial 1 -->
        <div class="tutorial-card">

          <div class="tutorial-thumbnail">

            <img
              src="assets/tutorials/platform.jpg"
              alt="Knowing Your Platform"
            />

            <span class="tutorial-duration">16:50</span>

            <div class="tutorial-play">▶</div>

          </div>

          <div class="tutorial-details">

            <h3>Knowing Your Platform</h3>

            <p class="tutorial-description">
              Learn how to confidently use the platform from Day 1.
            </p>

            <ul class="tutorial-topics">
              <li>📁 Choosing your coding workspace</li>
              <li>💻 Solving daily coding questions</li>
              <li>🔁 Using the Revision section</li>
              <li>📝 Code Editor basics</li>
              <li>▶ Running and testing code on your local system</li>
            </ul>

            <a
  class="watch-button"
  href="https://drive.google.com/file/d/1Z5QTS3JFSwYpkBDyfdS95ZdsF8qfU0LM/view?usp=sharing"
  target="_blank"
  rel="noopener noreferrer"
>
  ▶ Watch Tutorial
</a>

          </div>

        </div>

        <!-- Tutorial 2 -->
        <div class="tutorial-card">

          <div class="tutorial-thumbnail">

            <img
              src="assets/tutorials/github.jpg"
              alt="GitHub Tutorial"
            />

            <span class="tutorial-duration">9:35</span>

            <div class="tutorial-play">▶</div>

          </div>

          <div class="tutorial-details">

            <h3>GitHub Tutorial</h3>

            <p class="tutorial-description">
              Learn a professional Git workflow to maintain your
              100 Days of Code repository.
            </p>

            <ul class="tutorial-topics">
              <li>📂 Creating a local Git repository</li>
              <li>🔗 Connecting it to your 100 Days of Code folder</li>
              <li>➕ Adding files to staging</li>
              <li>💾 Writing meaningful commits</li>
              <li>☁️ Pushing your code to GitHub regularly</li>
            </ul>

           <a
  class="watch-button"
  href="YOUR_GITHUB_TUTORIAL_LINK"
  target="_blank"
  rel="noopener noreferrer"
>
  ▶ Watch Tutorial
</a>
          </div>

        </div>

      </div>
    `;
  }
  playVideo(url) {
    this.videoPlayer.src = url;
    this.videoOverlay.hidden = false;
  }

  closeVideo() {
    this.videoOverlay.hidden = true;
    this.videoPlayer.src = "";
  }
}

export default new Tutorial();
