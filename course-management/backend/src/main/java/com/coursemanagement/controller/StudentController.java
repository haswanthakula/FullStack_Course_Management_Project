package com.coursemanagement.controller;

import com.coursemanagement.dto.UserDTO;
import com.coursemanagement.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class StudentController {

	private final StudentService studentService;

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('STUDENT')")
	public ResponseEntity<UserDTO> getStudentProfile(@PathVariable String id) {
		return ResponseEntity.ok(studentService.getStudentProfile(id));
	}

	@PutMapping("/{id}/profile")
	@PreAuthorize("hasRole('STUDENT')")
	public ResponseEntity<UserDTO> updateStudentProfile(
			@PathVariable String id,
			@RequestBody UserDTO userDTO) {
		return ResponseEntity.ok(studentService.updateStudentProfile(id, userDTO));
	}
}