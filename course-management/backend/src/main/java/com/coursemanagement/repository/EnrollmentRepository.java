package com.coursemanagement.repository;

import com.coursemanagement.entity.Course;
import com.coursemanagement.entity.Enrollment;
import com.coursemanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, String> {
	List<Enrollment> findByStudent(User student);
	List<Enrollment> findByCourse(Course course);
	boolean existsByCourseAndStudent(Course course, User student);
	long countByCourse(Course course);
	List<Enrollment> findByStudentId(String studentId);
	
	@Modifying
	@Query("DELETE FROM Enrollment e WHERE e.student.id = ?1")
	void deleteByStudentId(String studentId);
	
	@Modifying
	@Query("DELETE FROM Enrollment e WHERE e.course.id = ?1")
	void deleteByCourseId(String courseId);

	boolean existsByCourse(Course course);
	
	@Query("SELECT COUNT(e) > 0 FROM Enrollment e WHERE e.course.id = ?1")
	boolean existsByCourseId(String courseId);
}