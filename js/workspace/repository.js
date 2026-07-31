// ==========================================
// Workspace Repository
// File System Access API
// ==========================================

class WorkspaceRepository {
  // ==========================================
  // Workspace
  // ==========================================

  /**
   * Creates (or opens) the application workspace.
   *
   * @param {FileSystemDirectoryHandle} parentHandle
   * @returns {Promise<FileSystemDirectoryHandle>}
   */
  async openWorkspace(parentHandle) {
    return await parentHandle.getDirectoryHandle("100DaysOfCode", {
      create: true,
    });
  }

  /**
   * Creates (or opens) a directory.
   *
   * @param {FileSystemDirectoryHandle} parent
   * @param {string} name
   * @returns {Promise<FileSystemDirectoryHandle>}
   */
  async getDirectory(parent, name) {
    return await parent.getDirectoryHandle(name, {
      create: true,
    });
  }

  /**
   * Creates (or opens) a file.
   *
   * @param {FileSystemDirectoryHandle} parent
   * @param {string} name
   * @param {boolean} create
   * @returns {Promise<FileSystemFileHandle>}
   */
  async getFile(parent, name, create = true) {
    return await parent.getFileHandle(name, {
      create,
    });
  }

  // ==========================================
  // Generic File Operations
  // ==========================================

  async writeFile(fileHandle, content) {
    const writable = await fileHandle.createWritable();

    await writable.write(content);

    await writable.close();
  }

  async readFile(fileHandle) {
    const file = await fileHandle.getFile();

    return await file.text();
  }

  async writeJson(fileHandle, object) {
    await this.writeFile(fileHandle, JSON.stringify(object, null, 4));
  }

  async readJson(fileHandle) {
    const text = await this.readFile(fileHandle);

    return JSON.parse(text);
  }

  // ==========================================
  // Solution Files
  // ==========================================

  getDayFolderName(day) {
    return `Day${String(day).padStart(2, "0")}`;
  }

  getSolutionFileName(questionId) {
    return `Q${String(questionId).padStart(3, "0")}.c`;
  }

  async getDayDirectory(workspaceHandle, day) {
    const daysHandle = await this.getDirectory(workspaceHandle, "days");

    return await this.getDirectory(daysHandle, this.getDayFolderName(day));
  }

  async getSolutionFile(workspaceHandle, day, questionId, create = true) {
    const dayDirectory = await this.getDayDirectory(workspaceHandle, day);

    return await this.getFile(
      dayDirectory,
      this.getSolutionFileName(questionId),
      create
    );
  }

  async saveSolution(workspaceHandle, day, questionId, code) {
    const fileHandle = await this.getSolutionFile(
      workspaceHandle,
      day,
      questionId
    );

    await this.writeFile(fileHandle, code);
  }

  async loadSolution(workspaceHandle, day, questionId) {
    try {
      const fileHandle = await this.getSolutionFile(
        workspaceHandle,
        day,
        questionId,
        false
      );

      return await this.readFile(fileHandle);
    } catch {
      return null;
    }
  }

  /**
   * Returns the last-modified timestamp of a saved solution file, if any.
   *
   * @param {FileSystemDirectoryHandle} workspaceHandle
   * @param {number} day
   * @param {number} questionId
   * @returns {Promise<number|null>}
   */
  async getSolutionLastModified(workspaceHandle, day, questionId) {
    try {
      const fileHandle = await this.getSolutionFile(
        workspaceHandle,
        day,
        questionId,
        false
      );

      const file = await fileHandle.getFile();

      return file.size > 0 ? file.lastModified : null;
    } catch {
      return null;
    }
  }

  // ==========================================
  // Progress
  // ==========================================

  async getProgressFile(workspaceHandle) {
    const systemDirectory = await this.getDirectory(workspaceHandle, ".system");

    return await this.getFile(systemDirectory, "progress.json");
  }

  async readProgress(workspaceHandle) {
    const fileHandle = await this.getProgressFile(workspaceHandle);

    return await this.readJson(fileHandle);
  }

  async writeProgress(workspaceHandle, progress) {
    const fileHandle = await this.getProgressFile(workspaceHandle);

    await this.writeJson(fileHandle, progress);
  }
  /**
   * Returns a timestamp suitable for history filenames.
   *
   * Example:
   * 20260810_103015
   *
   * @returns {string}
   */
  createTimestamp() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
  }
  /**
   * Returns all files inside a directory.
   *
   * @param {FileSystemDirectoryHandle} directoryHandle
   * @returns {Promise<Array>}
   */
  async getFiles(directoryHandle) {
    const files = [];

    for await (const [name, handle] of directoryHandle.entries()) {
      if (handle.kind === "file") {
        files.push({
          name,
          handle,
        });
      }
    }

    files.sort((a, b) => b.name.localeCompare(a.name));

    return files;
  }
}

export default new WorkspaceRepository();
