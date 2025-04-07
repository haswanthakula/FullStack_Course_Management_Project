package com.coursemanagement.controller;

import com.coursemanagement.dto.CourseDTO;
import com.coursemanagement.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class CourseController {

	private final CourseService courseService;

	@GetMapping
	public ResponseEntity<List<CourseDTO>> getAllCourses(
			@RequestParam(required = false) String category,
			@RequestParam(required = false) String level,
			@RequestParam(required = false) String language,
			@RequestParam(required = false) Double maxPrice,
			@RequestParam(required = false) String search) {
		return ResponseEntity.ok(courseService.getFilteredCourses(category, level, language, maxPrice, search));
	}

	@GetMapping("/{id}")
	public ResponseEntity<CourseDTO> getCourseById(@PathVariable String id) {
		return ResponseEntity.ok(courseService.getCourseById(id));
	}

	@GetMapping("/category/{category}")
	public ResponseEntity<List<CourseDTO>> getCoursesByCategory(@PathVariable String category) {
		return ResponseEntity.ok(courseService.getCoursesByCategory(category));
	}

	@GetMapping("/level/{level}")
	public ResponseEntity<List<CourseDTO>> getCoursesByLevel(@PathVariable String level) {
		return ResponseEntity.ok(courseService.getCoursesByLevel(level));
	}

	@GetMapping("/language/{language}")
	public ResponseEntity<List<CourseDTO>> getCoursesByLanguage(@PathVariable String language) {
		return ResponseEntity.ok(courseService.getCoursesByLanguage(language));
	}

	@GetMapping("/price")
	public ResponseEntity<List<CourseDTO>> getCoursesByMaxPrice(@RequestParam Double maxPrice) {
		return ResponseEntity.ok(courseService.getCoursesByMaxPrice(maxPrice));
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<CourseDTO> createCourse(@RequestBody CourseDTO courseDTO) {
		return ResponseEntity.ok(courseService.createCourse(courseDTO));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<CourseDTO> updateCourse(@PathVariable String id, @RequestBody CourseDTO courseDTO) {
		return ResponseEntity.ok(courseService.updateCourse(id, courseDTO));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> deleteCourse(@PathVariable String id) {
		courseService.deleteCourse(id);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/top")
	public ResponseEntity<List<CourseDTO>> getTopCourses() {
		return ResponseEntity.ok(courseService.getTopCourses());
	}
}
