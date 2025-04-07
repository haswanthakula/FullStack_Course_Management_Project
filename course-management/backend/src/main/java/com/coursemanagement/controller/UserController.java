package com.coursemanagement.controller;

import com.coursemanagement.dto.UserDTO;
import com.coursemanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@PutMapping("/{userId}/profile")
	@PreAuthorize("hasRole('STUDENT')")
	public ResponseEntity<?> updateProfile(@PathVariable String userId, @RequestBody UserDTO userDTO) {
		userService.updateProfile(userId, userDTO);
		return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
	}

	@PutMapping("/{userId}/password")
	@PreAuthorize("hasRole('STUDENT')")
	public ResponseEntity<?> updatePassword(
			@PathVariable String userId,
			@RequestBody Map<String, String> passwords) {
		userService.updatePassword(userId, passwords.get("oldPassword"), passwords.get("newPassword"));
		return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
	}
}