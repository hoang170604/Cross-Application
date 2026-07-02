// Diary Page Script
// Handles the diary page functionality and initialization

class DiaryPage {
  constructor(diaryService, foodService) {
    this.diaryService = diaryService;
    this.foodService = foodService;
    this.currentDate = new Date();
    this.entries = [];
    this.dailySummary = null;
  }

  /**
   * Initialize the diary page
   */
  async init() {
    try {
      console.log('Initializing diary page...');
      this.attachEventListeners();
      await this.loadDailyData();
      this.render();
    } catch (error) {
      console.error('Failed to initialize diary page:', error);
      this.showError('Failed to load diary data');
    }
  }

  /**
   * Load daily diary data
   */
  async loadDailyData() {
    try {
      const dateString = this.formatDateForAPI(this.currentDate);
      
      const [entries, summary] = await Promise.all([
        this.diaryService.getEntriesByDate(dateString),
        this.diaryService.getDailySummary(dateString),
      ]);

      this.entries = entries;
      this.dailySummary = summary;
    } catch (error) {
      console.error('Failed to load daily data:', error);
      throw error;
    }
  }

  /**
   * Render diary page content
   */
  render() {
    console.log('Rendering diary page...');
    this.renderDailySummary();
    this.renderEntries();
  }

  /**
   * Render daily summary statistics
   */
  renderDailySummary() {
    const summaryContainer = document.getElementById('daily-summary');
    if (!summaryContainer || !this.dailySummary) return;

    summaryContainer.innerHTML = `
      <div class="daily-summary">
        <h2>Daily Summary - ${this.formatDateForDisplay(this.currentDate)}</h2>
        <div class="summary-stats">
          <div class="stat">
            <div class="stat-value">${this.dailySummary.calories || 0}</div>
            <div class="stat-label">Calories</div>
          </div>
          <div class="stat">
            <div class="stat-value">${this.dailySummary.protein || 0}g</div>
            <div class="stat-label">Protein</div>
          </div>
          <div class="stat">
            <div class="stat-value">${this.dailySummary.carbs || 0}g</div>
            <div class="stat-label">Carbs</div>
          </div>
          <div class="stat">
            <div class="stat-value">${this.dailySummary.fat || 0}g</div>
            <div class="stat-label">Fat</div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render diary entries list
   */
  renderEntries() {
    const entriesContainer = document.getElementById('entries-list');
    if (!entriesContainer) return;

    if (this.entries.length === 0) {
      entriesContainer.innerHTML = '<p class="empty-state">No entries for this date</p>';
      return;
    }

    const entriesHTML = this.entries
      .map(
        (entry) => `
        <div class="diary-entry" data-id="${entry.id}">
          <div class="entry-header">
            <h3>${entry.foodName}</h3>
            <button class="btn-delete" data-id="${entry.id}">Delete</button>
          </div>
          <div class="entry-details">
            <p><strong>Quantity:</strong> ${entry.quantity} ${entry.unit}</p>
            <p><strong>Calories:</strong> ${entry.calories}</p>
            <p><strong>Time:</strong> ${entry.time}</p>
          </div>
        </div>
      `
      )
      .join('');

    entriesContainer.innerHTML = entriesHTML;
    this.attachDeleteListeners();
  }

  /**
   * Add a new entry
   */
  async addEntry(entryData) {
    try {
      const newEntry = await this.diaryService.createEntry(entryData);
      this.entries.push(newEntry);
      await this.loadDailyData();
      this.render();
      this.showSuccess('Entry added successfully');
    } catch (error) {
      console.error('Failed to add entry:', error);
      this.showError('Failed to add entry');
    }
  }

  /**
   * Delete an entry
   */
  async deleteEntry(entryId) {
    try {
      await this.diaryService.deleteEntry(entryId);
      this.entries = this.entries.filter((e) => e.id !== entryId);
      await this.loadDailyData();
      this.render();
      this.showSuccess('Entry deleted successfully');
    } catch (error) {
      console.error('Failed to delete entry:', error);
      this.showError('Failed to delete entry');
    }
  }

  /**
   * Navigate to previous date
   */
  async previousDate() {
    this.currentDate.setDate(this.currentDate.getDate() - 1);
    await this.loadDailyData();
    this.render();
  }

  /**
   * Navigate to next date
   */
  async nextDate() {
    this.currentDate.setDate(this.currentDate.getDate() + 1);
    await this.loadDailyData();
    this.render();
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    const prevBtn = document.getElementById('prev-date-btn');
    const nextBtn = document.getElementById('next-date-btn');
    const addBtn = document.getElementById('add-entry-btn');

    if (prevBtn) prevBtn.addEventListener('click', () => this.previousDate());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextDate());
    if (addBtn) addBtn.addEventListener('click', () => this.showAddEntryModal());
  }

  /**
   * Attach delete button listeners
   */
  attachDeleteListeners() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const entryId = e.target.dataset.id;
        if (confirm('Are you sure you want to delete this entry?')) {
          this.deleteEntry(entryId);
        }
      });
    });
  }

  /**
   * Show add entry modal
   */
  showAddEntryModal() {
    // Implementation for modal
    console.log('Show add entry modal');
  }

  /**
   * Format date for API
   */
  formatDateForAPI(date) {
    return date.toISOString().split('T')[0];
  }

  /**
   * Format date for display
   */
  formatDateForDisplay(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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
  // Assuming diaryService and foodService are initialized globally
  if (typeof window.diaryService !== 'undefined') {
    const diaryPage = new DiaryPage(window.diaryService, window.foodService);
    await diaryPage.init();
    window.diaryPage = diaryPage; // Make available globally
  }
});
