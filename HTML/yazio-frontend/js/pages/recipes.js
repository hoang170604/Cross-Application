// Recipes Page Script
// Handles the recipes page functionality and recipe display

class RecipesPage {
  constructor(foodService) {
    this.foodService = foodService;
    this.recipes = [];
    this.categories = [];
    this.selectedCategory = null;
    this.searchQuery = '';
    this.currentPage = 1;
    this.itemsPerPage = 12;
  }

  /**
   * Initialize the recipes page
   */
  async init() {
    try {
      console.log('Initializing recipes page...');
      this.attachEventListeners();
      await this.loadCategories();
      await this.loadRecipes();
      this.render();
    } catch (error) {
      console.error('Failed to initialize recipes page:', error);
      this.showError('Failed to load recipes');
    }
  }

  /**
   * Load food categories
   */
  async loadCategories() {
    try {
      this.categories = await this.foodService.getFoodCategories();
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  }

  /**
   * Load recipes
   */
  async loadRecipes() {
    try {
      const params = {
        page: this.currentPage,
        limit: this.itemsPerPage,
      };

      if (this.selectedCategory) {
        params.category = this.selectedCategory;
      }

      if (this.searchQuery) {
        this.recipes = await this.foodService.searchRecipes(this.searchQuery, params);
      } else {
        this.recipes = await this.foodService.getRecipes(params);
      }
    } catch (error) {
      console.error('Failed to load recipes:', error);
      throw error;
    }
  }

  /**
   * Render recipes page content
   */
  render() {
    console.log('Rendering recipes page...');
    this.renderFilters();
    this.renderRecipeGrid();
  }

  /**
   * Render filter section
   */
  renderFilters() {
    const filtersContainer = document.getElementById('recipe-filters');
    if (!filtersContainer) return;

    const filterHTML = this.categories
      .map(
        (category) => `
        <span class="badge ${this.selectedCategory === category.id ? 'active' : ''}" 
              data-category="${category.id}">
          ${category.name}
        </span>
      `
      )
      .join('');

    filtersContainer.innerHTML = filterHTML;

    const badges = filtersContainer.querySelectorAll('.badge');
    badges.forEach((badge) => {
      badge.addEventListener('click', (e) => {
        this.selectedCategory = e.target.dataset.category === this.selectedCategory 
          ? null 
          : e.target.dataset.category;
        this.currentPage = 1;
        this.loadRecipes().then(() => this.render());
      });
    });
  }

  /**
   * Render recipe grid
   */
  renderRecipeGrid() {
    const gridContainer = document.getElementById('recipes-grid');
    if (!gridContainer) return;

    if (this.recipes.length === 0) {
      gridContainer.innerHTML = '<p class="empty-state">No recipes found</p>';
      return;
    }

    const recipesHTML = this.recipes
      .map(
        (recipe) => `
        <div class="recipe-card" data-id="${recipe.id}">
          <div class="recipe-image">🍽️</div>
          <div class="recipe-details">
            <div class="recipe-title">${recipe.name}</div>
            <div class="recipe-meta">
              <span>⏱️ ${recipe.prepTime || 'N/A'} min</span>
              <span>👥 ${recipe.servings || 'N/A'} servings</span>
            </div>
            <div class="recipe-meta">
              <span>🔥 ${recipe.calories || 0} cal</span>
              <span>⭐ ${recipe.difficulty || 'Medium'}</span>
            </div>
            <p class="recipe-description">${recipe.description || 'No description'}</p>
            <div class="recipe-tags">
              ${(recipe.tags || [])
                .slice(0, 3)
                .map((tag) => `<span class="badge">${tag}</span>`)
                .join('')}
            </div>
            <div class="recipe-actions">
              <button class="recipe-actions__btn btn-view" data-id="${recipe.id}">View Recipe</button>
              <button class="recipe-actions__btn btn-save" data-id="${recipe.id}">Save</button>
            </div>
          </div>
        </div>
      `
      )
      .join('');

    gridContainer.innerHTML = recipesHTML;
    this.attachRecipeListeners();
  }

  /**
   * Attach recipe action listeners
   */
  attachRecipeListeners() {
    const viewButtons = document.querySelectorAll('.btn-view');
    const saveButtons = document.querySelectorAll('.btn-save');

    viewButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const recipeId = e.target.dataset.id;
        this.viewRecipe(recipeId);
      });
    });

    saveButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const recipeId = e.target.dataset.id;
        this.saveRecipe(recipeId, e.target);
      });
    });
  }

  /**
   * View recipe details
   */
  async viewRecipe(recipeId) {
    try {
      const recipe = await this.foodService.getRecipeDetails(recipeId);
      this.showRecipeModal(recipe);
    } catch (error) {
      console.error('Failed to load recipe details:', error);
      this.showError('Failed to load recipe details');
    }
  }

  /**
   * Save recipe to favorites
   */
  async saveRecipe(recipeId, button) {
    try {
      await this.foodService.saveRecipe(recipeId);
      button.textContent = 'Saved';
      button.disabled = true;
      this.showSuccess('Recipe saved to favorites');
    } catch (error) {
      console.error('Failed to save recipe:', error);
      this.showError('Failed to save recipe');
    }
  }

  /**
   * Show recipe details modal
   */
  showRecipeModal(recipe) {
    console.log('Show recipe modal for:', recipe);
    // Implementation for modal
  }

  /**
   * Handle search
   */
  async handleSearch(query) {
    this.searchQuery = query;
    this.currentPage = 1;
    await this.loadRecipes();
    this.render();
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    const searchInput = document.getElementById('recipe-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }
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
  if (typeof window.foodService !== 'undefined') {
    const recipesPage = new RecipesPage(window.foodService);
    await recipesPage.init();
    window.recipesPage = recipesPage;
  }
});
