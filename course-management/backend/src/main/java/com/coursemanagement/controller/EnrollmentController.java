package com.coursemanagement.controller;

import com.coursemanagement.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class EnrollmentController {

	private final EnrollmentService enrollmentService;

	@PostMapping("/{courseId}")
	@PreAuthorize("hasRole('STUDENT')")
	public ResponseEntity<?> enrollInCourse(@PathVariable String courseId) {
		enrollmentService.enrollStudent(courseId);
		return ResponseEntity.ok(Map.of("message", "Successfully enrolled in course"));
	}

	@DeleteMapping("/{enrollmentId}")
	@PreAuthorize("hasRole('STUDENT')")
	public ResponseEntity<?> unenrollFromCourse(@PathVariable String enrollmentId) {
		enrollmentService.unenrollStudent(enrollmentId);
		return ResponseEntity.ok(Map.of("message", "Successfully unenrolled from course"));
	}

	@PutMapping("/{enrollmentId}/complete")
	@PreAuthorize("hasRole('STUDENT')")
	public ResponseEntity<?> markCourseAsCompleted(@PathVariable String enrollmentId) {
		enrollmentService.markCourseAsCompleted(enrollmentId);
		return ResponseEntity.ok(Map.of("message", "Course marked as completed"));
	}

	@GetMapping("/student/{studentId}")
	@PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
	public ResponseEntity<?> getStudentEnrollments(@PathVariable String studentId) {
		return ResponseEntity.ok(enrollmentService.getStudentEnrollments(studentId));
	}

	@GetMapping("/course/{courseId}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getCourseEnrollments(@PathVariable String courseId) {
		return ResponseEntity.ok(enrollmentService.getCourseEnrollments(courseId));
	}

	@GetMapping("/student/{studentId}/stats")
	@PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
	public ResponseEntity<?> getStudentEnrollmentStats(@PathVariable String studentId) {
		return ResponseEntity.ok(Map.of(
			"total", enrollmentService.getTotalEnrollments(studentId),
			"completed", enrollmentService.getCompletedEnrollments(studentId),
			"inProgress", enrollmentService.getInProgressEnrollments(studentId)
		));
	}
}