// Food Service
// Handles food database and recipe-related API operations

class FoodService {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.endpoint = '/food';
  }

  /**
   * Search foods by name or keywords
   * @param {string} query - Search query
   * @param {object} params - Additional query parameters (limit, page, filters)
   * @returns {Promise} Array of matching foods
   */
  async searchFoods(query, params = {}) {
    try {
      return await this.apiClient.get(`${this.endpoint}/search`, {
        params: { query, ...params },
      });
    } catch (error) {
      console.error('Failed to search foods:', error);
      throw error;
    }
  }

  /**
   * Get food details by ID
   * @param {string} foodId - Food ID
   * @returns {Promise} Food details including nutrition info
   */
  async getFoodDetails(foodId) {
    try {
      return await this.apiClient.get(`${this.endpoint}/${foodId}`);
    } catch (error) {
      console.error('Failed to fetch food details:', error);
      throw error;
    }
  }

  /**
   * Get all recipes
   * @param {object} params - Query parameters (page, limit, category, tags)
   * @returns {Promise} Paginated recipes
   */
  async getRecipes(params = {}) {
    try {
      return await this.apiClient.get(`${this.endpoint}/recipes`, { params });
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      throw error;
    }
  }

  /**
   * Get recipe details
   * @param {string} recipeId - Recipe ID
   * @returns {Promise} Recipe details including ingredients and instructions
   */
  async getRecipeDetails(recipeId) {
    try {
      return await this.apiClient.get(`${this.endpoint}/recipes/${recipeId}`);
    } catch (error) {
      console.error('Failed to fetch recipe details:', error);
      throw error;
    }
  }

  /**
   * Search recipes
   * @param {string} query - Search query
   * @param {object} params - Query parameters (category, tags, difficulty)
   * @returns {Promise} Matching recipes
   */
  async searchRecipes(query, params = {}) {
    try {
      return await this.apiClient.get(`${this.endpoint}/recipes/search`, {
        params: { query, ...params },
      });
    } catch (error) {
      console.error('Failed to search recipes:', error);
      throw error;
    }
  }

  /**
   * Get food categories
   * @returns {Promise} All available food categories
   */
  async getFoodCategories() {
    try {
      return await this.apiClient.get(`${this.endpoint}/categories`);
    } catch (error) {
      console.error('Failed to fetch food categories:', error);
      throw error;
    }
  }

  /**
   * Get popular foods
   * @param {number} limit - Limit number of results
   * @returns {Promise} Popular foods
   */
  async getPopularFoods(limit = 10) {
    try {
      return await this.apiClient.get(`${this.endpoint}/popular`, {
        params: { limit },
      });
    } catch (error) {
      console.error('Failed to fetch popular foods:', error);
      throw error;
    }
  }

  /**
   * Save a recipe to user's favorites
   * @param {string} recipeId - Recipe ID
   * @returns {Promise} Saved recipe
   */
  async saveRecipe(recipeId) {
    try {
      return await this.apiClient.post(`${this.endpoint}/favorites/${recipeId}`);
    } catch (error) {
      console.error('Failed to save recipe:', error);
      throw error;
    }
  }

  /**
   * Get user's favorite recipes
   * @returns {Promise} Array of favorite recipes
   */
  async getFavoriteRecipes() {
    try {
      return await this.apiClient.get(`${this.endpoint}/favorites`);
    } catch (error) {
      console.error('Failed to fetch favorite recipes:', error);
      throw error;
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FoodService;
}
