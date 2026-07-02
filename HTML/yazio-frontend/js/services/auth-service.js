// Authentication Service
// Handles user authentication, login, logout, and token management

class AuthService {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.tokenKey = 'authToken';
    this.userKey = 'currentUser';
  }

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} User data and token
   */
  async login(email, password) {
    try {
      const response = await this.apiClient.post('/auth/login', {
        email,
        password,
      });

      if (response.token) {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.userKey, JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {object} userData - User registration data
   * @returns {Promise} User data and token
   */
  async register(userData) {
    try {
      const response = await this.apiClient.post('/auth/register', userData);

      if (response.token) {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.userKey, JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  /**
   * Get current user
   * @returns {object} Current user data
   */
  getCurrentUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem(this.tokenKey);
  }

  /**
   * Get auth token
   * @returns {string} Auth token
   */
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthService;
}
