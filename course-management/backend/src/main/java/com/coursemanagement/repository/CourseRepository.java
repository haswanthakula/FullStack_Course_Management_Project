package com.coursemanagement.repository;

import com.coursemanagement.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
	List<Course> findByCategory(String category);
	List<Course> findByLevel(String level);
	List<Course> findByLanguage(String language);
	List<Course> findByPriceLessThanEqual(Double price);

	@Query("SELECT c FROM Course c ORDER BY c.createdAt DESC")
	List<Course> findAllOrderByCreatedAtDesc();
}