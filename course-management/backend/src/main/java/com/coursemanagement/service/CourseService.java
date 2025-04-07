package com.coursemanagement.service;

import com.coursemanagement.dto.CourseDTO;
import com.coursemanagement.entity.Course;
import com.coursemanagement.mapper.CourseMapper;
import com.coursemanagement.repository.CourseRepository;
import com.coursemanagement.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {
	
	private final CourseRepository courseRepository;
	private final CourseMapper courseMapper;
	private final EnrollmentRepository enrollmentRepository;

	public CourseDTO createCourse(CourseDTO courseDTO) {
		Course course = courseMapper.dtoToCourse(courseDTO);
		course.setId(UUID.randomUUID().toString());
		return courseMapper.courseToDto(courseRepository.save(course));
	}

	public List<CourseDTO> getFilteredCourses(String category, String level, String language, Double maxPrice, String search) {
		List<Course> courses = courseRepository.findAll();
		
		return courses.stream()
			.filter(course -> category == null || category.isEmpty() || course.getCategory().equalsIgnoreCase(category))
			.filter(course -> level == null || level.isEmpty() || course.getLevel().equalsIgnoreCase(level))
			.filter(course -> language == null || language.isEmpty() || course.getLanguage().equalsIgnoreCase(language))
			.filter(course -> maxPrice == null || course.getPrice() <= maxPrice)
			.filter(course -> search == null || search.isEmpty() || 
					course.getTitle().toLowerCase().contains(search.toLowerCase()) ||
					course.getDescription().toLowerCase().contains(search.toLowerCase()))
			.map(courseMapper::courseToDto)
			.collect(Collectors.toList());
	}

	public List<CourseDTO> getAllCourses() {
		return courseRepository.findAll().stream()
				.map(courseMapper::courseToDto)
				.collect(Collectors.toList());
	}
	
	public Page<Course> getCoursesPaginated(Pageable pageable) {
		return courseRepository.findAll(pageable);
	}
	
	public CourseDTO getCourseById(String id) {
		Course course = courseRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Course not found"));
		return courseMapper.courseToDto(course);
	}
	
	public CourseDTO updateCourse(String id, CourseDTO courseDTO) {
		if (!courseRepository.existsById(id)) {
			throw new RuntimeException("Course not found");
		}
		Course updatedCourse = courseMapper.dtoToCourse(courseDTO);
		updatedCourse.setId(id);
		return courseMapper.courseToDto(courseRepository.save(updatedCourse));
	}
	
	public boolean hasCourseEnrollments(String courseId) {
		Course course = courseRepository.findById(courseId)
				.orElseThrow(() -> new RuntimeException("Course not found"));
		return enrollmentRepository.existsByCourse(course);
	}

	@Transactional
	public void deleteCourse(String id) {
		try {
			Course course = courseRepository.findById(id)
					.orElseThrow(() -> new RuntimeException("Course not found"));
					
			// Delete all enrollments first
			enrollmentRepository.deleteByCourseId(id);
			
			// Then delete the course
			courseRepository.delete(course);
		} catch (Exception e) {
			throw new RuntimeException("Failed to delete course: " + e.getMessage());
		}
	}
	
	public List<CourseDTO> getCoursesByCategory(String category) {
		return courseRepository.findByCategory(category).stream()
				.map(courseMapper::courseToDto)
				.collect(Collectors.toList());
	}
	
	public List<CourseDTO> getCoursesByLevel(String level) {
		return courseRepository.findByLevel(level).stream()
				.map(courseMapper::courseToDto)
				.collect(Collectors.toList());
	}
	
	public List<CourseDTO> getCoursesByLanguage(String language) {
		return courseRepository.findByLanguage(language).stream()
				.map(courseMapper::courseToDto)
				.collect(Collectors.toList());
	}
	
	public List<CourseDTO> getCoursesByMaxPrice(Double price) {
		return courseRepository.findByPriceLessThanEqual(price).stream()
				.map(courseMapper::courseToDto)
				.collect(Collectors.toList());
	}

	public List<CourseDTO> getTopCourses() {
		return courseRepository.findAllOrderByCreatedAtDesc().stream()
				.limit(4)
				.map(courseMapper::courseToDto)
				.collect(Collectors.toList());
	}
}