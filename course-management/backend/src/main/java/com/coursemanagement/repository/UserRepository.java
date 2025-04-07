package com.coursemanagement.repository;

import com.coursemanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
	Optional<User> findByEmail(String email);
	boolean existsByEmail(String email);
	List<User> findByRole(String role);
	int countByRole(String role);

	@Query("SELECT u FROM User u WHERE u.role = 'ROLE_STUDENT' ORDER BY u.createdAt DESC")
	List<User> findAllStudentsOrderByCreatedAtDesc();
}