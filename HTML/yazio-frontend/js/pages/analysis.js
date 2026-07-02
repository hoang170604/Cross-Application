// Analysis Page Script
// Handles data visualization and analytics

class AnalysisPage {
  constructor(diaryService, fastingService) {
    this.diaryService = diaryService;
    this.fastingService = fastingService;
    this.analysisData = null;
    this.period = 'week'; // week, month, year
  }

  /**
   * Initialize the analysis page
   */
  async init() {
    try {
      console.log('Initializing analysis page...');
      this.attachEventListeners();
      await this.loadAnalysisData();
      this.render();
    } catch (error) {
      console.error('Failed to initialize analysis page:', error);
      this.showError('Failed to load analysis data');
    }
  }

  /**
   * Load analysis data
   */
  async loadAnalysisData() {
    try {
      const [diaryStats, fastingStats] = await Promise.all([
        this.loadDiaryStatistics(),
        this.loadFastingStatistics(),
      ]);

      this.analysisData = {
        diary: diaryStats,
        fasting: fastingStats,
      };
    } catch (error) {
      console.error('Failed to load analysis data:', error);
      throw error;
    }
  }

  /**
   * Load diary statistics
   */
  async loadDiaryStatistics() {
    try {
      // This would require a statistics endpoint in DiaryService
      // For now, we'll return mock data
      return {
        totalCalories: 15000,
        averageCalories: 2143,
        totalMacros: {
          protein: 400,
          carbs: 1800,
          fat: 500,
        },
        foodItems: [
          { name: 'Chicken', count: 15, calories: 3000 },
          { name: 'Rice', count: 14, calories: 4000 },
          { name: 'Vegetables', count: 20, calories: 1500 },
        ],
      };
    } catch (error) {
      console.error('Failed to load diary statistics:', error);
      throw error;
    }
  }

  /**
   * Load fasting statistics
   */
  async loadFastingStatistics() {
    try {
      return await this.fastingService.getStatistics(this.period);
    } catch (error) {
      console.error('Failed to load fasting statistics:', error);
      throw error;
    }
  }

  /**
   * Render analysis page
   */
  render() {
    console.log('Rendering analysis page...');
    this.renderNutritionSummary();
    this.renderCaloriesTrend();
    this.renderMacrosBreakdown();
    this.renderFastingStats();
  }

  /**
   * Render nutrition summary
   */
  renderNutritionSummary() {
    const container = document.getElementById('nutrition-summary');
    if (!container || !this.analysisData) return;

    const diary = this.analysisData.diary;
    const html = `
      <div class="summary-card">
        <h3>Nutrition Summary</h3>
        <div class="summary-stats">
          <div class="stat">
            <div class="stat-value">${diary.totalCalories}</div>
            <div class="stat-label">Total Calories (${this.period})</div>
          </div>
          <div class="stat">
            <div class="stat-value">${diary.averageCalories}</div>
            <div class="stat-label">Average Daily</div>
          </div>
          <div class="stat">
            <div class="stat-value">${diary.totalMacros.protein}g</div>
            <div class="stat-label">Total Protein</div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  /**
   * Render calories trend chart
   */
  renderCaloriesTrend() {
    const container = document.getElementById('calories-chart');
    if (!container) return;

    const html = `
      <div class="chart-container">
        <h3>Calories Trend</h3>
        <canvas id="calories-trend-canvas"></canvas>
        <p class="chart-note">Chart visualization would be rendered here using Chart.js or similar library</p>
      </div>
    `;

    container.innerHTML = html;
    this.drawCaloriesChart();
  }

  /**
   * Draw calories trend chart
   */
  drawCaloriesChart() {
    // Implementation for Chart.js or similar
    console.log('Drawing calories trend chart...');
  }

  /**
   * Render macros breakdown
   */
  renderMacrosBreakdown() {
    const container = document.getElementById('macros-breakdown');
    if (!container || !this.analysisData) return;

    const macros = this.analysisData.diary.totalMacros;
    const total = macros.protein + macros.carbs + macros.fat;

    const proteinPercent = ((macros.protein / total) * 100).toFixed(1);
    const carbsPercent = ((macros.carbs / total) * 100).toFixed(1);
    const fatPercent = ((macros.fat / total) * 100).toFixed(1);

    const html = `
      <div class="macros-container">
        <h3>Macronutrients Breakdown</h3>
        <div class="macros-chart">
          <canvas id="macros-pie-chart"></canvas>
        </div>
        <div class="macros-details">
          <div class="macro-item">
            <div class="macro-bar protein"></div>
            <div class="macro-info">
              <div class="macro-name">Protein</div>
              <div class="macro-value">${macros.protein}g (${proteinPercent}%)</div>
            </div>
          </div>
          <div class="macro-item">
            <div class="macro-bar carbs"></div>
            <div class="macro-info">
              <div class="macro-name">Carbs</div>
              <div class="macro-value">${macros.carbs}g (${carbsPercent}%)</div>
            </div>
          </div>
          <div class="macro-item">
            <div class="macro-bar fat"></div>
            <div class="macro-info">
              <div class="macro-name">Fat</div>
              <div class="macro-value">${macros.fat}g (${fatPercent}%)</div>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  /**
   * Render fasting statistics
   */
  renderFastingStats() {
    const container = document.getElementById('fasting-stats');
    if (!container || !this.analysisData) return;

    const fasting = this.analysisData.fasting;
    const html = `
      <div class="fasting-stats-container">
        <h3>Fasting Statistics</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${fasting.totalSessions || 0}</div>
            <div class="stat-label">Total Sessions</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${fasting.averageDuration || 0}h</div>
            <div class="stat-label">Average Duration</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${fasting.longestStreak || 0}</div>
            <div class="stat-label">Longest Streak</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${((fasting.completionRate || 0) * 100).toFixed(1)}%</div>
            <div class="stat-label">Completion Rate</div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  /**
   * Change analysis period
   */
  async changePeriod(newPeriod) {
    this.period = newPeriod;
    await this.loadAnalysisData();
    this.render();
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    const weekBtn = document.getElementById('period-week');
    const monthBtn = document.getElementById('period-month');
    const yearBtn = document.getElementById('period-year');

    if (weekBtn) weekBtn.addEventListener('click', () => this.changePeriod('week'));
    if (monthBtn) monthBtn.addEventListener('click', () => this.changePeriod('month'));
    if (yearBtn) yearBtn.addEventListener('click', () => this.changePeriod('year'));
  }

  /**
   * Show success message
   */
  showSuccess(message) {
    console.log('Success:', message);
  }

  /**
   * Show error message
   */
  showError(message) {
    console.error('Error:', message);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  if (typeof window.diaryService !== 'undefined' && typeof window.fastingService !== 'undefined') {
    const analysisPage = new AnalysisPage(window.diaryService, window.fastingService);
    await analysisPage.init();
    window.analysisPage = analysisPage;
  }
});
