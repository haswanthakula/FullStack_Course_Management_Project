package com.coursemanagement.service;

import com.coursemanagement.dto.CourseDTO;
import com.coursemanagement.dto.UserDTO;
import com.coursemanagement.entity.Course;
import java.util.UUID;
import com.coursemanagement.mapper.CourseMapper;
import com.coursemanagement.mapper.UserMapper;
import com.coursemanagement.repository.CourseRepository;
import com.coursemanagement.repository.EnrollmentRepository;
import com.coursemanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
	private final UserRepository userRepository;
	private final CourseRepository courseRepository;
	private final EnrollmentRepository enrollmentRepository;
	private final UserMapper userMapper;
	private final CourseMapper courseMapper;



	public List<UserDTO> getAllStudents() {
		try {
			return userRepository.findAllStudentsOrderByCreatedAtDesc()
					.stream()
					.map(userMapper::userToDto)
					.collect(Collectors.toList());
		} catch (Exception e) {
			throw new RuntimeException("Error fetching students: " + e.getMessage());
		}
	}

	public List<CourseDTO> getAllCourses() {
		try {
			return courseRepository.findAll().stream()
					.map(courseMapper::courseToDto)
					.collect(Collectors.toList());
		} catch (Exception e) {
			throw new RuntimeException("Error fetching courses: " + e.getMessage());
		}
	}

	public Map<String, Integer> getDashboardStats() {
		try {
			Map<String, Integer> stats = new HashMap<>();
			stats.put("totalStudents", userRepository.countByRole("ROLE_STUDENT"));
			stats.put("totalCourses", (int) courseRepository.count());
			stats.put("totalEnrollments", (int) enrollmentRepository.count());
			return stats;
		} catch (Exception e) {
			throw new RuntimeException("Error fetching dashboard stats: " + e.getMessage());
		}
	}

	@Transactional
	public void deleteStudent(String id) {
		try {
			if (!userRepository.existsById(id)) {
				throw new RuntimeException("Student not found");
			}
			enrollmentRepository.deleteByStudentId(id);
			userRepository.deleteById(id);
		} catch (Exception e) {
			throw new RuntimeException("Error deleting student: " + e.getMessage());
		}
	}

	@Transactional
	public void deleteCourse(String id) {
		try {
			if (!courseRepository.existsById(id)) {
				throw new RuntimeException("Course not found");
			}
			
			// Check for enrollments first
			boolean hasEnrollments = enrollmentRepository.existsByCourseId(id);
			
			// Delete enrollments first if they exist
			if (hasEnrollments) {
				enrollmentRepository.deleteByCourseId(id);
			}
			
			// Then delete the course
			courseRepository.deleteById(id);
		} catch (Exception e) {
			throw new RuntimeException("Failed to delete course: " + e.getMessage());
		}
	}

	public CourseDTO createCourse(CourseDTO courseDTO) {
		try {
			Course course = courseMapper.dtoToCourse(courseDTO);
			course.setId(UUID.randomUUID().toString());
			Course savedCourse = courseRepository.save(course);
			return courseMapper.courseToDto(savedCourse);
		} catch (Exception e) {
			throw new RuntimeException("Error creating course: " + e.getMessage());
		}
	}

	public CourseDTO updateCourse(String id, CourseDTO courseDTO) {
		try {
			if (!courseRepository.existsById(id)) {
				throw new RuntimeException("Course not found");
			}
			Course course = courseMapper.dtoToCourse(courseDTO);
			course.setId(id);
			Course updatedCourse = courseRepository.save(course);
			return courseMapper.courseToDto(updatedCourse);
		} catch (Exception e) {
			throw new RuntimeException("Error updating course: " + e.getMessage());
		}
	}

	public boolean hasCourseEnrollments(String courseId) {
		try {
			if (!courseRepository.existsById(courseId)) {
				throw new RuntimeException("Course not found");
			}
			return enrollmentRepository.existsByCourseId(courseId);
		} catch (Exception e) {
			throw new RuntimeException("Failed to check course enrollments: " + e.getMessage());
		}
	}

	public List<Map<String, Object>> getStudentEnrollmentCounts() {
		try {
			return userRepository.findAllStudentsOrderByCreatedAtDesc()
				.stream()
				.map(student -> {
					Map<String, Object> studentInfo = new HashMap<>();
					studentInfo.put("id", student.getId());
					studentInfo.put("name", student.getName());
					studentInfo.put("email", student.getEmail());
					studentInfo.put("createdAt", student.getCreatedAt());
					studentInfo.put("enrollmentCount", enrollmentRepository.findByStudent(student).size());
					return studentInfo;
				})
				.collect(Collectors.toList());
		} catch (Exception e) {
			throw new RuntimeException("Error fetching student enrollment counts: " + e.getMessage());
		}
	}
}