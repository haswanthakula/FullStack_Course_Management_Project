package com.coursemanagement.service;

import com.coursemanagement.entity.Course;
import com.coursemanagement.entity.Enrollment;
import com.coursemanagement.entity.User;
import com.coursemanagement.repository.CourseRepository;
import com.coursemanagement.repository.EnrollmentRepository;
import com.coursemanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

	private final EnrollmentRepository enrollmentRepository;
	private final CourseRepository courseRepository;
	private final UserRepository userRepository;

	@Transactional
	public void enrollStudent(String courseId) {
		String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
		User student = userRepository.findByEmail(userEmail)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		Course course = courseRepository.findById(courseId)
				.orElseThrow(() -> new RuntimeException("Course not found"));

		// Check if student is already enrolled
		if (enrollmentRepository.existsByCourseAndStudent(course, student)) {
			throw new RuntimeException("Already enrolled in this course");
		}

		// Check enrollment limit
		long currentEnrollments = enrollmentRepository.countByCourse(course);
		if (currentEnrollments >= course.getEnrollmentLimit()) {
			throw new RuntimeException("Course enrollment limit reached");
		}

		Enrollment enrollment = new Enrollment();
		enrollment.setId(UUID.randomUUID().toString());
		enrollment.setCourse(course);
		enrollment.setStudent(student);
		enrollment.setEnrollmentDate(LocalDateTime.now());
		enrollment.setCompleted(false);

		enrollmentRepository.save(enrollment);
	}

	@Transactional
	public void unenrollStudent(String enrollmentId) {
		String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
		User student = userRepository.findByEmail(userEmail)
				.orElseThrow(() -> new RuntimeException("User not found"));

		Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
				.orElseThrow(() -> new RuntimeException("Enrollment not found"));

		if (!enrollment.getStudent().getId().equals(student.getId())) {
			throw new RuntimeException("Not authorized to unenroll from this course");
		}

		enrollmentRepository.delete(enrollment);
	}

	@Transactional
	public void markCourseAsCompleted(String enrollmentId) {
		String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
		User student = userRepository.findByEmail(userEmail)
				.orElseThrow(() -> new RuntimeException("User not found"));

		Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
				.orElseThrow(() -> new RuntimeException("Enrollment not found"));

		if (!enrollment.getStudent().getId().equals(student.getId())) {
			throw new RuntimeException("Not authorized to mark this course as completed");
		}

		enrollment.setCompleted(true);
		enrollment.setCompletionDate(LocalDateTime.now());
		enrollmentRepository.save(enrollment);
	}

	public List<Enrollment> getStudentEnrollments(String studentId) {
		User student = userRepository.findById(studentId)
				.orElseThrow(() -> new RuntimeException("Student not found"));
		return enrollmentRepository.findByStudent(student);
	}

	public List<Enrollment> getCourseEnrollments(String courseId) {
		Course course = courseRepository.findById(courseId)
				.orElseThrow(() -> new RuntimeException("Course not found"));
		return enrollmentRepository.findByCourse(course);
	}

	public int getTotalEnrollments(String studentId) {
		User student = userRepository.findById(studentId)
				.orElseThrow(() -> new RuntimeException("Student not found"));
		return enrollmentRepository.findByStudent(student).size();
	}

	public int getCompletedEnrollments(String studentId) {
		User student = userRepository.findById(studentId)
				.orElseThrow(() -> new RuntimeException("Student not found"));
		return (int) enrollmentRepository.findByStudent(student)
				.stream()
				.filter(Enrollment::getCompleted)
				.count();
	}

	public int getInProgressEnrollments(String studentId) {
		User student = userRepository.findById(studentId)
				.orElseThrow(() -> new RuntimeException("Student not found"));
		return (int) enrollmentRepository.findByStudent(student)
				.stream()
				.filter(e -> !e.getCompleted())
				.count();
	}
}