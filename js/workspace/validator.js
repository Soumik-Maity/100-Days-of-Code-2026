// ==========================================
// Workspace Validator
// Ensures the workspace structure exists
// ==========================================

import WorkspaceRepository from "./repository.js";

class WorkspaceValidator {
  /**
   * Ensure the workspace structure exists.
   *
   * Workspace
   * ├── .system
   * │   ├── metadata.json
   * │   ├── progress.json
   * │   └── settings.json
   * │
   * └── days
   *     ├── Day01
   *     ├── Day02
   *     ├── ...
   *     └── Day100
   *
   * @param {FileSystemDirectoryHandle} workspaceHandle
   */
  async ensureStructure(workspaceHandle) {
    // ----------------------------------
    // System Folder
    // ----------------------------------

    const systemHandle = await WorkspaceRepository.getDirectory(
      workspaceHandle,
      ".system"
    );

    // ----------------------------------
    // Days Folder
    // ----------------------------------

    const daysHandle = await WorkspaceRepository.getDirectory(
      workspaceHandle,
      "days"
    );

    // ----------------------------------
    // Create Day01 ... Day100
    // ----------------------------------

    for (let day = 1; day <= 100; day++) {
      await WorkspaceRepository.getDirectory(
        daysHandle,
        `Day${String(day).padStart(2, "0")}`
      );
    }

    // ----------------------------------
    // metadata.json
    // ----------------------------------

    await this.ensureJsonFile(systemHandle, "metadata.json", {
      workspaceVersion: 1,
      createdAt: new Date().toISOString(),
      language: "C",
    });

    // ----------------------------------
    // progress.json
    // ----------------------------------

    await this.ensureJsonFile(systemHandle, "progress.json", {
      currentDay: 1,
      lastOpenedQuestion: null,
      questionsSolved: [],
      streak: 0,
      longestStreak: 0,
    });

    // ----------------------------------
    // settings.json
    // ----------------------------------

    await this.ensureJsonFile(systemHandle, "settings.json", {
      theme: "dark",
      fontSize: 16,
    });
  }

  /**
   * Creates a JSON file only if it is empty.
   *
   * @param {FileSystemDirectoryHandle} directory
   * @param {string} fileName
   * @param {Object} defaultData
   */
  async ensureJsonFile(directory, fileName, defaultData) {
    const fileHandle = await WorkspaceRepository.getFile(directory, fileName);

    const file = await fileHandle.getFile();

    if (file.size === 0) {
      await WorkspaceRepository.writeJson(fileHandle, defaultData);
    }
  }
}

export default new WorkspaceValidator();
