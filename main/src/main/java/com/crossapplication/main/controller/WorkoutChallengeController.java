package com.crossapplication.main.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crossapplication.main.dto.WorkoutChallengeDTO;
import com.crossapplication.main.entity.WorkoutChallenge;
import com.crossapplication.main.service.interfaces.WorkoutChallengeService;

@RestController
@RequestMapping("/api/workout-challenges")
public class WorkoutChallengeController {

    @Autowired
    private WorkoutChallengeService workoutChallengeService;

    @GetMapping
    public List<WorkoutChallenge> listAll() {
        return workoutChallengeService.listAll();
    }

    @GetMapping("/user/{userId}")
    public List<WorkoutChallenge> listForUser(@PathVariable Long userId) {
        return workoutChallengeService.listByUser(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        Optional<WorkoutChallenge> opt = workoutChallengeService.getById(id);
        return opt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@jakarta.validation.Valid @RequestBody WorkoutChallengeDTO dto) {
        try {
            return ResponseEntity.ok(workoutChallengeService.create(dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody WorkoutChallengeDTO dto) {
        try {
            return ResponseEntity.ok(workoutChallengeService.update(id, dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        workoutChallengeService.delete(id);
        return ResponseEntity.ok().build();
    }
}
