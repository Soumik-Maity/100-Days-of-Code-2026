// ==========================================
// Calendar Utility
// Calculates course day from calendar date
// Weekends are skipped
// ==========================================

class Calendar {
  constructor() {
    // August 10, 2026
    // Month is zero-based (7 = August)
    this.courseStartDate = new Date(2026, 6, 20);
    this.courseStartDate.setHours(0, 0, 0, 0);
  }

  /**
   * Returns true if the given date is Saturday or Sunday.
   *
   * @param {Date} date
   * @returns {boolean}
   */
  isWeekend(date) {
    const day = date.getDay();

    return day === 0 || day === 6;
  }

  /**
   * Returns true if the course has started.
   *
   * @returns {boolean}
   */
  hasStarted() {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return today >= this.courseStartDate;
  }

  /**
   * Returns true if today is a weekend.
   *
   * @returns {boolean}
   */
  isTodayWeekend() {
    return this.isWeekend(new Date());
  }

  /**
   * Returns the current course day.
   *
   * Returns:
   * 0 -> Course not started
   * 1..100 -> Current day
   *
   * @returns {number}
   */
  getCurrentDay() {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (today < this.courseStartDate) {
      return 0;
    }

    let current = new Date(this.courseStartDate);

    let dayNumber = 0;

    while (current <= today) {
      if (!this.isWeekend(current)) {
        dayNumber++;
      }

      current.setDate(current.getDate() + 1);
    }

    return Math.min(dayNumber, 100);
  }

  /**
   * Returns today's status.
   *
   * @returns {{
   *   started:boolean,
   *   weekend:boolean,
   *   day:number
   * }}
   */
  getStatus() {
    return {
      started: this.hasStarted(),
      weekend: this.isTodayWeekend(),
      day: this.getCurrentDay(),
    };
  }
}

export default new Calendar();
