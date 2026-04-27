package com.crossapplication.main.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crossapplication.main.dto.ApiResponse;
import com.crossapplication.main.dto.FastingSessionDTO;
import com.crossapplication.main.entity.FastingSession;
import com.crossapplication.main.service.interfaces.FastingSessionService;

@RestController
@RequestMapping("/api/fasting-sessions")
public class FastingSessionController {

	@Autowired
	private FastingSessionService fastingSessionService;

	@GetMapping("/user/{userId}")
	@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")
	public ResponseEntity<ApiResponse<?>> listForUser(@PathVariable Long userId) {
		try {
			List<FastingSession> sessions = fastingSessionService.listByUser(userId);
			return ResponseEntity.ok(ApiResponse.success(sessions));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "LIST_FAILED"));
		}
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
	public ResponseEntity<ApiResponse<?>> get(@PathVariable Long id) {
		try {
			Optional<FastingSession> opt = fastingSessionService.getById(id);
			if (opt.isPresent()) {
				return ResponseEntity.ok(ApiResponse.success(opt.get()));
			}
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Fasting session not found", "SESSION_NOT_FOUND"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "GET_FAILED"));
		}
	}

	@PostMapping
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<?>> create(@jakarta.validation.Valid @RequestBody FastingSessionDTO dto) {
		try {
			FastingSession created = fastingSessionService.create(dto);
			return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created, "Fasting session created successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "CREATE_FAILED"));
		}
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
	public ResponseEntity<ApiResponse<?>> update(@PathVariable Long id, @RequestBody FastingSessionDTO dto) {
		try {
			FastingSession updated = fastingSessionService.update(id, dto);
			return ResponseEntity.ok(ApiResponse.success(updated, "Fasting session updated successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "UPDATE_FAILED"));
		}
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
	public ResponseEntity<ApiResponse<?>> delete(@PathVariable Long id) {
		try {
			fastingSessionService.delete(id);
			return ResponseEntity.noContent().build();
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "DELETE_FAILED"));
		}
	}
}
