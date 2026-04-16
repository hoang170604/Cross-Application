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

import com.crossapplication.main.dto.FastingSessionDTO;
import com.crossapplication.main.entity.FastingSession;
import com.crossapplication.main.service.interfaces.FastingSessionService;

@RestController
@RequestMapping("/api/fasting-sessions")
public class FastingSessionController {

	@Autowired
	private FastingSessionService fastingSessionService;

	@GetMapping("/user/{userId}")
	public List<FastingSession> listForUser(@PathVariable Long userId) {
		return fastingSessionService.listByUser(userId);
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> get(@PathVariable Long id) {
		Optional<FastingSession> opt = fastingSessionService.getById(id);
		return opt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<?> create(@jakarta.validation.Valid @RequestBody FastingSessionDTO dto) {
		try {
			return ResponseEntity.ok(fastingSessionService.create(dto));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> update(@PathVariable Long id, @RequestBody FastingSessionDTO dto) {
		try {
			return ResponseEntity.ok(fastingSessionService.update(id, dto));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable Long id) {
		fastingSessionService.delete(id);
		return ResponseEntity.ok().build();
	}
}
