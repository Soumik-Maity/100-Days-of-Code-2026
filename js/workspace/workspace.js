// ==========================================
// Workspace Manager
// Coordinates workspace operations
// ==========================================

import WorkspaceRepository from "./repository.js";
import WorkspaceValidator from "./validator.js";

class WorkspaceManager {
  constructor() {
    this.workspaceHandle = null;
  }

  // ==========================================
  // Workspace
  // ==========================================

  /**
   * Prompt the user to select a parent folder.
   * Creates or opens the 100DaysOfCode workspace.
   *
   * @returns {Promise<boolean>}
   */
  async selectWorkspace() {
    try {
      const parentHandle = await window.showDirectoryPicker({
        mode: "readwrite",
      });

      const workspaceHandle = await WorkspaceRepository.openWorkspace(
        parentHandle
      );

      this.workspaceHandle = workspaceHandle;

      await WorkspaceValidator.ensureStructure(workspaceHandle);

      return true;
    } catch (error) {
      console.error("Workspace selection failed.", error);

      return false;
    }
  }

  /**
   * Returns current workspace handle.
   *
   * @returns {FileSystemDirectoryHandle|null}
   */
  getWorkspace() {
    return this.workspaceHandle;
  }

  /**
   * Returns whether a workspace is active.
   *
   * @returns {boolean}
   */
  hasWorkspace() {
    return this.workspaceHandle !== null;
  }

  // ==========================================
  // Solutions
  // ==========================================

  /**
   * Save solution.
   *
   * @param {number} day
   * @param {number} questionId
   * @param {string} code
   */
  async saveSolution(day, questionId, code) {
    if (!this.workspaceHandle) {
      throw new Error("Workspace not selected.");
    }

    await WorkspaceRepository.saveSolution(
      this.workspaceHandle,
      day,
      questionId,
      code
    );
  }
  /**
   * Save a history snapshot.
   *
   * chapters/
   *   Day01/
   *     .history/
   *       Q001_20260810_103015.c
   *
   * @param {number} day
   * @param {number} questionId
   * @param {string} code
   */
  async saveHistory(day, questionId, code) {
    if (!this.workspaceHandle) {
      throw new Error("Workspace not selected.");
    }

    const daysHandle = await WorkspaceRepository.getDirectory(
      this.workspaceHandle,
      "days"
    );

    const dayHandle = await WorkspaceRepository.getDirectory(
      daysHandle,
      `Day${String(day).padStart(2, "0")}`
    );

    const historyHandle = await WorkspaceRepository.getDirectory(
      dayHandle,
      "history"
    );

    const timestamp = WorkspaceRepository.createTimestamp();

    const fileName = `Q${String(questionId).padStart(3, "0")}_${timestamp}.c`;

    const fileHandle = await WorkspaceRepository.getFile(
      historyHandle,
      fileName
    );

    await WorkspaceRepository.writeFile(fileHandle, code);
  }
  async getHistory(day, questionId) {
    console.log("Searching Day:", day);
    console.log("Searching Question:", questionId);
    if (!this.workspaceHandle) {
      throw new Error("Workspace not selected.");
    }

    const daysHandle = await WorkspaceRepository.getDirectory(
      this.workspaceHandle,
      "days"
    );

    const dayHandle = await WorkspaceRepository.getDirectory(
      daysHandle,
      `Day${String(day).padStart(2, "0")}`
    );

    const historyHandle = await WorkspaceRepository.getDirectory(
      dayHandle,
      "history"
    );

    const files = await WorkspaceRepository.getFiles(historyHandle);

    const prefix = `Q${String(questionId).padStart(3, "0")}_`;

    return files.filter((file) => file.name.startsWith(prefix));
  }

  /**
   * Load a history snapshot.
   *
   * @param {FileSystemFileHandle} fileHandle
   * @returns {Promise<string>}
   */
  async loadHistoryFile(fileHandle) {
    return await WorkspaceRepository.readFile(fileHandle);
  }

  /**
   * Load solution.
   *
   * @param {number} day
   * @param {number} questionId
   * @returns {Promise<string|null>}
   */
  async loadSolution(day, questionId) {
    if (!this.workspaceHandle) {
      return null;
    }

    return await WorkspaceRepository.loadSolution(
      this.workspaceHandle,
      day,
      questionId
    );
  }

  // ==========================================
  // Progress
  // ==========================================

  /**
   * Read progress.json.
   *
   * @returns {Promise<Object|null>}
   */
  async getProgress() {
    if (!this.workspaceHandle) {
      return null;
    }

    return await WorkspaceRepository.readProgress(this.workspaceHandle);
  }

  /**
   * Save progress.json.
   *
   * @param {Object} progress
   */
  async saveProgress(progress) {
    if (!this.workspaceHandle) {
      throw new Error("Workspace not selected.");
    }

    await WorkspaceRepository.writeProgress(this.workspaceHandle, progress);
  }
}

export default new WorkspaceManager();
