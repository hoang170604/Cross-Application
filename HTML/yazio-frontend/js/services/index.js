/**
 * Services Index
 * Central export point for all services
 */

// Import all services
// Note: In a real project, you might use module.exports or ES6 imports

class ServiceManager {
    static get Auth() {
        return AuthService;
    }

    static get Activity() {
        return ActivityService;
    }

    static get Food() {
        return FoodService;
    }

    static get Diary() {
        return DiaryService;
    }

    static get Fasting() {
        return FastingService;
    }

    static get Water() {
        return WaterService;
    }

    static get Progress() {
        return ProgressService;
    }

    static get Challenge() {
        return WorkoutChallengeService;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServiceManager;
}
