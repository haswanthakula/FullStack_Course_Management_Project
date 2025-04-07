package com.coursemanagement.controller;

import com.coursemanagement.dto.UserDTO;
import com.coursemanagement.dto.CourseDTO;
import com.coursemanagement.service.AdminService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

	private final AdminService adminService;


	@GetMapping("/students")
	public ResponseEntity<List<UserDTO>> getAllStudents() {
		return ResponseEntity.ok(adminService.getAllStudents());
	}

	@GetMapping("/courses")
	public ResponseEntity<List<CourseDTO>> getAllCourses() {
		return ResponseEntity.ok(adminService.getAllCourses());
	}

	@GetMapping("/stats")
	public ResponseEntity<Map<String, Integer>> getDashboardStats() {
		return ResponseEntity.ok(adminService.getDashboardStats());
	}

	@DeleteMapping("/students/{id}")
	public ResponseEntity<Void> deleteStudent(@PathVariable String id) {
		adminService.deleteStudent(id);
		return ResponseEntity.ok().build();
	}

	@DeleteMapping("/courses/{id}")
	public ResponseEntity<Void> deleteCourse(@PathVariable String id) {
		adminService.deleteCourse(id);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/courses")
	public ResponseEntity<CourseDTO> createCourse(@RequestBody CourseDTO courseDTO) {
		return ResponseEntity.ok(adminService.createCourse(courseDTO));
	}

	@PutMapping("/courses/{id}")
	public ResponseEntity<CourseDTO> updateCourse(@PathVariable String id, @RequestBody CourseDTO courseDTO) {
		return ResponseEntity.ok(adminService.updateCourse(id, courseDTO));
	}

	@GetMapping("/courses/{id}/enrollments")
	public ResponseEntity<Boolean> checkCourseEnrollments(@PathVariable String id) {
		return ResponseEntity.ok(adminService.hasCourseEnrollments(id));
	}

	@GetMapping("/students/enrollment-counts")
	public ResponseEntity<List<Map<String, Object>>> getStudentEnrollmentCounts() {
		return ResponseEntity.ok(adminService.getStudentEnrollmentCounts());
	}
}