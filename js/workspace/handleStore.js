// ==========================================
// Workspace Handle Store
// Persists the FileSystemDirectoryHandle across
// sessions using IndexedDB (handles cannot be
// serialized into localStorage).
// ==========================================

const DB_NAME = "100DaysOfCodeDB";
const STORE_NAME = "handles";
const HANDLE_KEY = "workspaceParentHandle";

class HandleStore {
  openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME);
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Persist the parent directory handle chosen by the user.
   *
   * @param {FileSystemDirectoryHandle} handle
   */
  async saveHandle(handle) {
    const db = await this.openDatabase();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");

      tx.objectStore(STORE_NAME).put(handle, HANDLE_KEY);

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Retrieve the previously stored parent directory handle, if any.
   *
   * @returns {Promise<FileSystemDirectoryHandle|null>}
   */
  async getHandle() {
    const db = await this.openDatabase();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");

      const request = tx.objectStore(STORE_NAME).get(HANDLE_KEY);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Remove the stored handle.
   */
  async clearHandle() {
    const db = await this.openDatabase();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");

      tx.objectStore(STORE_NAME).delete(HANDLE_KEY);

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

export default new HandleStore();
