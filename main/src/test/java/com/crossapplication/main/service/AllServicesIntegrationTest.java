package com.crossapplication.main.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.crossapplication.main.dto.FastingSessionDTO;
import com.crossapplication.main.dto.WorkoutChallengeDTO;
import com.crossapplication.main.entity.Activity;
import com.crossapplication.main.entity.DailyNutrition;
import com.crossapplication.main.entity.FastingSession;
import com.crossapplication.main.entity.FastingState;
import com.crossapplication.main.entity.Meal;
import com.crossapplication.main.entity.MealLog;
import com.crossapplication.main.entity.User;
import com.crossapplication.main.entity.WaterLog;
import com.crossapplication.main.entity.WorkoutChallenge;
import com.crossapplication.main.repository.interfaces.ActivityRepository;
import com.crossapplication.main.repository.interfaces.DailyNutritionRepository;
import com.crossapplication.main.repository.interfaces.FastingSessionRepository;
import com.crossapplication.main.repository.interfaces.FastingStateRepository;
import com.crossapplication.main.repository.interfaces.FoodRepositoryInterface;
import com.crossapplication.main.repository.interfaces.MealLogRepository;
import com.crossapplication.main.repository.interfaces.MealRepositoryInterface;
import com.crossapplication.main.repository.interfaces.UserRepositoryInterface;
import com.crossapplication.main.repository.interfaces.WaterLogRepository;
import com.crossapplication.main.repository.interfaces.WorkoutChallengeRepository;
import com.crossapplication.main.service.interfaces.ActivityServiceInterface;
import com.crossapplication.main.service.interfaces.DailyNutritionService;
import com.crossapplication.main.service.interfaces.DiaryService;
import com.crossapplication.main.service.interfaces.FastingSessionService;
import com.crossapplication.main.service.interfaces.FastingStateService;
import com.crossapplication.main.service.interfaces.ProgressService;
import com.crossapplication.main.service.interfaces.WaterServiceInterface;
import com.crossapplication.main.service.interfaces.WorkoutChallengeService;

@SpringBootTest
@Transactional
public class AllServicesIntegrationTest {

    @Autowired
    private UserRepositoryInterface userRepo;

    @Autowired
    private FoodRepositoryInterface foodRepo;

    @Autowired
    private MealRepositoryInterface mealRepo;

    @Autowired
    private MealLogRepository mealLogRepo;

    @Autowired
    private ActivityRepository activityRepo;

    @Autowired
    private WaterLogRepository waterLogRepo;

    @Autowired
    private DailyNutritionRepository dailyRepo;

    @Autowired
    private FastingSessionRepository fastingSessionRepo;

    @Autowired
    private FastingStateRepository fastingStateRepo;

    @Autowired
    private WorkoutChallengeRepository workoutChallengeRepo;

    @Autowired
    private ActivityServiceInterface activityService;

    @Autowired
    private WaterServiceInterface waterService;

    @Autowired
    private DiaryService diaryService;

    @Autowired
    private FastingSessionService fastingSessionService;

    @Autowired
    private FastingStateService fastingStateService;

    @Autowired
    private ProgressService progressService;

    @Autowired
    private WorkoutChallengeService workoutChallengeService;

    @Autowired
    private DailyNutritionService dailyNutritionService;

    private User testUser;

    @BeforeEach
    public void setUp() {
        // Create test user
        testUser = new User();
        testUser.setEmail("testuser@example.com");
        testUser.setPassword("password123");
        testUser.setCreatedAt(LocalDate.now());
        testUser = userRepo.save(testUser);
    }

    @Test
    public void testActivityService_AddAndDelete() {
        LocalDateTime now = LocalDateTime.now();
        Activity activity = activityService.addActivity(
                testUser.getId(), "running", 30, 300.0, now, 5.0, 0, "app", null);
        
        assertThat(activity).isNotNull();
        assertThat(activity.getActivityType()).isEqualTo("running");
        assertThat(activity.getCaloriesBurned()).isEqualTo(300.0);

        activityService.deleteActivity(activity.getId());
        assertThat(activityRepo.findById(activity.getId()).isEmpty()).isTrue();
    }

    @Test
    public void testActivityService_GetCaloriesBurned() {
        LocalDate today = LocalDate.now();
        activityService.addActivity(testUser.getId(), "running", 30, 200.0, LocalDateTime.now(), 5.0, 0, "app", null);
        activityService.addActivity(testUser.getId(), "gym", 45, 300.0, LocalDateTime.now(), null, 0, "app", null);

        double total = activityService.getCaloriesBurned(testUser.getId(), today);
        assertThat(total).isEqualTo(500.0);
    }

    @Test
    public void testWaterService_LogWater() {
        LocalDateTime now = LocalDateTime.now();
        WaterLog log = waterService.logWater(testUser.getId(), now, 250.0, "app", null);

        assertThat(log).isNotNull();
        assertThat(log.getAmountMl()).isEqualTo(250.0);
        assertThat(log.getUser().getId()).isEqualTo(testUser.getId());
    }

    @Test
    public void testWaterService_GetDailyTotal() {
        LocalDate today = LocalDate.now();
        waterService.logWater(testUser.getId(), LocalDateTime.now(), 250.0, "app", null);
        waterService.logWater(testUser.getId(), LocalDateTime.now(), 500.0, "app", null);

        double total = waterService.getDailyTotal(testUser.getId(), today);
        assertThat(total).isEqualTo(750.0);
    }

    @Test
    public void testDiaryService_AddFoodToMeal() {
        LocalDate today = LocalDate.now();
        
        // Create test food
        com.crossapplication.main.entity.Food food = new com.crossapplication.main.entity.Food();
        food.setName("Rice");
        food.setCaloriesPer100g(130);
        food.setProteinPer100g(2.7f);
        food.setCarbPer100g(28);
        food.setFatPer100g(0.3f);
        food = foodRepo.saveFood(food);

        // Create meal log
        MealLog log = new MealLog();
        log.setFood(food);
        log.setQuantity(100);
        log.setCalories(130);
        log.setProtein(2.7);
        log.setCarb(28);
        log.setFat(0.3);

        // Add to breakfast
        MealLog saved = diaryService.addFoodToMeal(testUser.getId(), today, "breakfast", log);

        assertThat(saved).isNotNull();
        assertThat(saved.getFood().getName()).isEqualTo("Rice");
        assertThat(saved.getMeal()).isNotNull();
        assertThat(saved.getMeal().getMealType()).isEqualTo("breakfast");
    }

    @Test
    public void testDiaryService_GetDailyDiary() {
        LocalDate today = LocalDate.now();
        
        com.crossapplication.main.entity.Food food = new com.crossapplication.main.entity.Food();
        food.setName("Chicken");
        food.setCaloriesPer100g(165);
        food.setProteinPer100g(31);
        food.setCarbPer100g(0);
        food.setFatPer100g(3.6f);
        food = foodRepo.saveFood(food);

        MealLog log = new MealLog();
        log.setFood(food);
        log.setQuantity(150);
        log.setCalories(247.5);
        log.setProtein(46.5);
        log.setCarb(0);
        log.setFat(5.4);

        diaryService.addFoodToMeal(testUser.getId(), today, "lunch", log);
        
        List<Meal> meals = diaryService.getDailyDiary(testUser.getId(), today);
        assertThat(meals).isNotEmpty();
        assertThat(meals).anyMatch(m -> m.getMealType().equals("lunch"));
    }

    @Test
    public void testFastingSessionService_Create() {
        FastingSessionDTO dto = new FastingSessionDTO();
        dto.setUserId(testUser.getId());
        dto.setStartTime(LocalDateTime.now());
        dto.setDurationMinutes(480);
        dto.setIsCompleted(false);

        FastingSession session = fastingSessionService.create(dto);

        assertThat(session).isNotNull();
        assertThat(session.getUser().getId()).isEqualTo(testUser.getId());
        assertThat(session.getDurationMinutes()).isEqualTo(480);
        assertThat(session.getIsCompleted()).isFalse();
    }

    @Test
    public void testFastingStateService_StartAndStop() {
        LocalDateTime startTime = LocalDateTime.now();

        fastingStateService.startFasting(testUser.getId(), startTime, 16);

        var opt = fastingStateService.getByUserId(testUser.getId());
        assertThat(opt).isPresent();
        FastingState state = opt.get();
        assertThat(state.getIsFasting()).isTrue();
        assertThat(state.getFastingGoalHours()).isEqualTo(16);

        LocalDateTime endTime = LocalDateTime.now().plusHours(16);
        fastingStateService.stopFasting(testUser.getId(), endTime);

        var updatedOpt = fastingStateService.getByUserId(testUser.getId());
        assertThat(updatedOpt).isPresent();
        assertThat(updatedOpt.get().getIsFasting()).isFalse();
    }

    @Test
    public void testProgressService_LogWeight() {
        LocalDate today = LocalDate.now();
        double weight = 75.5;

        var logged = progressService.logWeight(testUser.getId(), weight, today);

        assertThat(logged).isNotNull();
        assertThat(logged.getWeight()).isEqualTo(weight);
        assertThat(logged.getDate()).isEqualTo(today);
    }

    @Test
    public void testProgressService_GetWeightHistory() {
        LocalDate start = LocalDate.now().minusDays(10);
        LocalDate end = LocalDate.now();

        progressService.logWeight(testUser.getId(), 75.0, LocalDate.now().minusDays(5));
        progressService.logWeight(testUser.getId(), 74.5, LocalDate.now());

        List<?> history = progressService.getWeightHistory(testUser.getId(), start, end);
        assertThat(history).isNotEmpty();
    }

    @Test
    public void testWorkoutChallengeService_Create() {
        WorkoutChallengeDTO dto = new WorkoutChallengeDTO();
        dto.setUserId(testUser.getId());
        dto.setChallengeName("Run 100km");
        dto.setTargetValue(100.0);
        dto.setCurrentValue(0.0);
        dto.setUnit("km");
        dto.setIsActive(true);
        dto.setStartDate(LocalDate.now());
        dto.setEndDate(LocalDate.now().plusDays(30));

        WorkoutChallenge challenge = workoutChallengeService.create(dto);

        assertThat(challenge).isNotNull();
        assertThat(challenge.getChallengeName()).isEqualTo("Run 100km");
        assertThat(challenge.getTargetValue()).isEqualTo(100.0);
        assertThat(challenge.getIsActive()).isTrue();
    }

    @Test
    public void testWorkoutChallengeService_Update() {
        WorkoutChallengeDTO dto = new WorkoutChallengeDTO();
        dto.setUserId(testUser.getId());
        dto.setChallengeName("100 pushups");
        dto.setTargetValue(100.0);
        dto.setCurrentValue(0.0);
        dto.setUnit("count");
        dto.setIsActive(true);
        dto.setStartDate(LocalDate.now());

        WorkoutChallenge challenge = workoutChallengeService.create(dto);

        WorkoutChallengeDTO updateDto = new WorkoutChallengeDTO();
        updateDto.setCurrentValue(100.0);

        WorkoutChallenge updated = workoutChallengeService.update(challenge.getId(), updateDto);

        assertThat(updated.getCurrentValue()).isEqualTo(100.0);
        assertThat(updated.getIsActive()).isFalse(); // Should be marked inactive when target reached
    }

    @Test
    public void testDailyNutritionService_AutoUpdate() {
        LocalDate today = LocalDate.now();
        
        // Add activity
        activityService.addActivity(testUser.getId(), "running", 30, 300.0, LocalDateTime.now(), null, 0, "app", null);

        // Add food via diary
        com.crossapplication.main.entity.Food food = new com.crossapplication.main.entity.Food();
        food.setName("Apple");
        food.setCaloriesPer100g(52);
        food.setProteinPer100g(0.3f);
        food.setCarbPer100g(14);
        food.setFatPer100g(0.2f);
        food = foodRepo.saveFood(food);

        MealLog log = new MealLog();
        log.setFood(food);
        log.setQuantity(200);
        log.setCalories(104);
        log.setProtein(0.6);
        log.setCarb(28);
        log.setFat(0.4);

        diaryService.addFoodToMeal(testUser.getId(), today, "breakfast", log);

        // Check daily nutrition
        var opt = dailyRepo.findByUserIdAndDate(testUser.getId(), today);
        assertThat(opt).isPresent();
        
        DailyNutrition daily = opt.get();
        // Net calories = eaten - burned = 104 - 300 = -196 (negative is OK for fasting)
        assertThat(daily.getTotalCarb()).isEqualTo(28);
    }

    @Test
    public void testFullUserJourney() {
        LocalDate today = LocalDate.now();
        
        // 1. User logs water
        waterService.logWater(testUser.getId(), LocalDateTime.now(), 2000.0, "app", null);
        double waterTotal = waterService.getDailyTotal(testUser.getId(), today);
        assertThat(waterTotal).isEqualTo(2000.0);

        // 2. User starts fasting
        LocalDateTime fastStart = LocalDateTime.now().minusHours(8);
        fastingStateService.startFasting(testUser.getId(), fastStart, 16);
        var fastingState = fastingStateService.getByUserId(testUser.getId());
        assertThat(fastingState.get().getIsFasting()).isTrue();

        // 3. User logs weight
        progressService.logWeight(testUser.getId(), 75.0, today);

        // 4. User creates a workout challenge
        WorkoutChallengeDTO challengeDto = new WorkoutChallengeDTO();
        challengeDto.setUserId(testUser.getId());
        challengeDto.setChallengeName("Daily 10k run");
        challengeDto.setTargetValue(10.0);
        challengeDto.setCurrentValue(0.0);
        challengeDto.setUnit("km");
        challengeDto.setIsActive(true);
        WorkoutChallenge challenge = workoutChallengeService.create(challengeDto);
        assertThat(challenge.getIsActive()).isTrue();

        // 5. User logs activity
        activityService.addActivity(testUser.getId(), "running", 60, 600.0, LocalDateTime.now(), 10.0, 8000, "app", null);

        // 6. User updates challenge
        WorkoutChallengeDTO updateDto = new WorkoutChallengeDTO();
        updateDto.setCurrentValue(10.0);
        WorkoutChallenge completedChallenge = workoutChallengeService.update(challenge.getId(), updateDto);
        assertThat(completedChallenge.getIsActive()).isFalse(); // Challenge completed

        // 7. User stops fasting
        fastingStateService.stopFasting(testUser.getId(), LocalDateTime.now());
        var updatedFastingState = fastingStateService.getByUserId(testUser.getId());
        assertThat(updatedFastingState.get().getIsFasting()).isFalse();

        // 8. User checks progress report
        var report = progressService.getNutritionSummary(testUser.getId(), today.minusDays(7), today);
        assertThat(report.getUserId()).isEqualTo(testUser.getId());

        System.out.println("✅ Full user journey test passed!");
    }
}
