package com.coursemanagement.controller;

import com.coursemanagement.dto.AuthRequest;
import com.coursemanagement.dto.UserDTO;
import com.coursemanagement.entity.User;
import com.coursemanagement.repository.UserRepository;
import com.coursemanagement.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

	private final AuthService authService;
	private final UserRepository userRepository;

	public AuthController(AuthService authService, UserRepository userRepository) {
		this.authService = authService;
		this.userRepository = userRepository;
	}

	@PostMapping("/register")
	public ResponseEntity<UserDTO> register(@Valid @RequestBody UserDTO userDTO) {
		return ResponseEntity.ok(authService.register(userDTO));
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
		try {
			System.out.println("Login request received for email: " + request.getEmail());
			String token = authService.login(request);
			
			User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new RuntimeException("User not found"));
			
			Map<String, Object> response = new HashMap<>();
			response.put("token", token);
			response.put("user", Map.of(
				"id", user.getId(),
				"name", user.getName(),
				"email", user.getEmail(),
				"role", user.getRole()
			));
			
			System.out.println("Login successful for user: " + user.getEmail());
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			System.err.println("Login failed for email: " + request.getEmail() + ", error: " + e.getMessage());
			return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
		}
	}
}