package com.crossapplication.main.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.crossapplication.main.dto.ApiResponse;
import com.crossapplication.main.dto.FoodDTO;
import com.crossapplication.main.entity.Food;
import com.crossapplication.main.entity.FoodCategory;
import com.crossapplication.main.service.interfaces.FoodServiceInterface;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/foods")
public class FoodController {

    @Autowired
    private FoodServiceInterface foodService;

    // GET /api/foods
    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllFood() {
        try {
            List<Food> foods = foodService.getAllFood();
            return ResponseEntity.ok(ApiResponse.success(foods));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "FOODS_FETCH_FAILED"));
        }
    }

    // GET /api/foods/search?name=keyword
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<?>> searchByName(@RequestParam(required = true) String name) {
        try {
            if (name == null || name.isBlank()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Search name required", "INVALID_SEARCH"));
            }
            List<Food> foods = foodService.searchByFoodName(name);
            return ResponseEntity.ok(ApiResponse.success(foods));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "SEARCH_FAILED"));
        }
    }

    // GET /api/foods/categories
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<?>> getAllCategories() {
        try {
            List<FoodCategory> categories = foodService.getAllCategories();
            return ResponseEntity.ok(ApiResponse.success(categories));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "CATEGORIES_FETCH_FAILED"));
        }
    }

    // GET /api/foods/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getFoodById(@PathVariable Long id) {
        try {
            Optional<Food> food = foodService.getFoodById(id);
            if (food.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Food not found", "FOOD_NOT_FOUND"));
            }
            return ResponseEntity.ok(ApiResponse.success(food.get()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "GET_FAILED"));
        }
    }

    // POST /api/foods
    @PostMapping
    public ResponseEntity<ApiResponse<?>> createFood(@Valid @RequestBody FoodDTO foodDTO) {
        try {
            if (foodDTO == null || foodDTO.getName() == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Food name is required", "INVALID_FOOD"));
            }
            FoodDTO created = foodService.createFood(foodDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(created, "Food created successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "CREATE_FAILED"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage(), "CREATE_ERROR"));
        }
    }

    // PUT /api/foods/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateFood(@PathVariable Long id, @Valid @RequestBody FoodDTO foodDTO) {
        try {
            if (id == null || foodDTO == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Invalid input", "INVALID_FOOD"));
            }
            FoodDTO updated = foodService.updateFood(id, foodDTO);
            return ResponseEntity.ok(ApiResponse.success(updated, "Food updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "UPDATE_FAILED"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage(), "UPDATE_ERROR"));
        }
    }

    // DELETE /api/foods/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteFood(@PathVariable Long id) {
        try {
            if (id == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Food id is required", "INVALID_ID"));
            }
            foodService.deleteFood(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "DELETE_FAILED"));
        }
    }

    // GET /api/foods/{id}/calculate?weight=100
    @GetMapping("/{id}/calculate")
    public ResponseEntity<ApiResponse<?>> calculateNutrition(@PathVariable Long id, @RequestParam Double weight) {
        try {
            if (id == null || weight == null || weight <= 0) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid food id or weight", "INVALID_PARAMS"));
            }
            Map<String, Double> nutrition = foodService.calculateNutrition(id, weight);
            return ResponseEntity.ok(ApiResponse.success(nutrition));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "CALCULATE_FAILED"));
        }
    }
}
