// Fasting Page Script
// Handles the fasting page functionality and timer

class FastingPage {
  constructor(fastingService) {
    this.fastingService = fastingService;
    this.currentSession = null;
    this.timerInterval = null;
    this.timerDisplay = null;
  }

  /**
   * Initialize the fasting page
   */
  async init() {
    try {
      console.log('Initializing fasting page...');
      this.timerDisplay = document.getElementById('timer-display');
      this.attachEventListeners();
      await this.loadFastingData();
      this.render();
    } catch (error) {
      console.error('Failed to initialize fasting page:', error);
      this.showError('Failed to load fasting data');
    }
  }

  /**
   * Load current fasting session
   */
  async loadFastingData() {
    try {
      this.currentSession = await this.fastingService.getCurrentSession();
      if (this.currentSession && this.currentSession.isActive) {
        this.startTimer();
      }
    } catch (error) {
      console.error('Failed to load fasting data:', error);
      throw error;
    }
  }

  /**
   * Render fasting page content
   */
  render() {
    console.log('Rendering fasting page...');
    this.renderFastingWindow();
    this.renderHistory();
  }

  /**
   * Render current fasting window/session
   */
  renderFastingWindow() {
    const windowContainer = document.getElementById('fasting-window');
    if (!windowContainer) return;

    if (!this.currentSession || !this.currentSession.isActive) {
      windowContainer.innerHTML = `
        <div class="fasting-window">
          <h3>Start a Fasting Session</h3>
          <button class="btn" id="start-fasting-btn">Start Fasting Now</button>
        </div>
      `;
    } else {
      const startTime = new Date(this.currentSession.startTime);
      const endTime = new Date(this.currentSession.endTime);
      
      windowContainer.innerHTML = `
        <div class="fasting-window">
          <h3>Current Fasting Session</h3>
          <div id="timer-display" class="timer-display">00:00:00</div>
          <div class="window-info">
            <div class="info-item">
              <div class="info-label">Started</div>
              <div class="info-value">${this.formatTime(startTime)}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Target End</div>
              <div class="info-value">${this.formatTime(endTime)}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Duration</div>
              <div class="info-value">${this.currentSession.duration}h</div>
            </div>
          </div>
          <button class="btn btn-danger" id="end-fasting-btn">End Fasting</button>
        </div>
      `;
      
      this.timerDisplay = document.getElementById('timer-display');
    }

    this.attachFastingListeners();
  }

  /**
   * Render fasting history
   */
  async renderHistory() {
    const historyContainer = document.getElementById('fasting-history');
    if (!historyContainer) return;

    try {
      const history = await this.fastingService.getHistory({ limit: 5 });

      if (history.length === 0) {
        historyContainer.innerHTML = '<p class="empty-state">No fasting sessions yet</p>';
        return;
      }

      const historyHTML = history
        .map(
          (session) => `
          <div class="history-item">
            <div>
              <div class="history-date">${this.formatDate(new Date(session.date))}</div>
              <div class="history-time">
                ${this.formatTime(new Date(session.startTime))} - ${this.formatTime(
            new Date(session.endTime)
          )}
              </div>
            </div>
            <div class="history-duration">${session.duration}h</div>
          </div>
        `
        )
        .join('');

      historyContainer.innerHTML = historyHTML;
    } catch (error) {
      console.error('Failed to load fasting history:', error);
      historyContainer.innerHTML = '<p class="error">Failed to load history</p>';
    }
  }

  /**
   * Start fasting timer
   */
  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (!this.currentSession) {
        clearInterval(this.timerInterval);
        return;
      }

      const elapsed = this.calculateElapsedTime();
      this.updateTimerDisplay(elapsed);
    }, 1000);
  }

  /**
   * Calculate elapsed time
   */
  calculateElapsedTime() {
    const startTime = new Date(this.currentSession.startTime).getTime();
    const now = Date.now();
    const elapsedMs = now - startTime;
    
    return {
      hours: Math.floor(elapsedMs / 3600000),
      minutes: Math.floor((elapsedMs % 3600000) / 60000),
      seconds: Math.floor((elapsedMs % 60000) / 1000),
    };
  }

  /**
   * Update timer display
   */
  updateTimerDisplay(elapsed) {
    if (this.timerDisplay) {
      const timeString = `${String(elapsed.hours).padStart(2, '0')}:${String(
        elapsed.minutes
      ).padStart(2, '0')}:${String(elapsed.seconds).padStart(2, '0')}`;
      this.timerDisplay.textContent = timeString;
    }
  }

  /**
   * Start fasting session
   */
  async startFasting() {
    try {
      const duration = prompt('Enter fasting duration (hours):', '16');
      if (!duration) return;

      this.currentSession = await this.fastingService.startSession({
        duration: parseInt(duration),
      });

      this.startTimer();
      this.render();
      this.showSuccess('Fasting session started');
    } catch (error) {
      console.error('Failed to start fasting session:', error);
      this.showError('Failed to start fasting session');
    }
  }

  /**
   * End fasting session
   */
  async endFasting() {
    try {
      if (confirm('Are you sure you want to end this fasting session?')) {
        await this.fastingService.endSession();
        clearInterval(this.timerInterval);
        this.currentSession = null;
        await this.loadFastingData();
        this.render();
        this.showSuccess('Fasting session ended');
      }
    } catch (error) {
      console.error('Failed to end fasting session:', error);
      this.showError('Failed to end fasting session');
    }
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Event listeners attached in renderFastingWindow
  }

  /**
   * Attach fasting action listeners
   */
  attachFastingListeners() {
    const startBtn = document.getElementById('start-fasting-btn');
    const endBtn = document.getElementById('end-fasting-btn');

    if (startBtn) {
      startBtn.addEventListener('click', () => this.startFasting());
    }
    if (endBtn) {
      endBtn.addEventListener('click', () => this.endFasting());
    }
  }

  /**
   * Format time (HH:MM)
   */
  formatTime(date) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Format date
   */
  formatDate(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Show success message
   */
  showSuccess(message) {
    console.log('Success:', message);
    // Implementation for toast notification
  }

  /**
   * Show error message
   */
  showError(message) {
    console.error('Error:', message);
    // Implementation for error notification
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  if (typeof window.fastingService !== 'undefined') {
    const fastingPage = new FastingPage(window.fastingService);
    await fastingPage.init();
    window.fastingPage = fastingPage;
  }
});
