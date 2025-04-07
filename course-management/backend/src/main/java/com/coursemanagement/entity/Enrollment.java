package com.coursemanagement.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "enrollments")
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Enrollment {

	@Id
	@Column(nullable = false)
	private String id;

	@Column(name = "completed", nullable = false)
	private Boolean completed = false;

	@Column(name = "completion_date")
	private LocalDateTime completionDate;

	@Column(name = "enrollment_date", nullable = false)
	private LocalDateTime enrollmentDate;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "course_id", nullable = false)
	private Course course;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "student_id", nullable = false)
	@JsonIgnoreProperties({"password", "authorities", "accountNonExpired", "accountNonLocked", "credentialsNonExpired", "enabled"})
	private User student;

	@PrePersist
	protected void onCreate() {
		if (enrollmentDate == null) {
			enrollmentDate = LocalDateTime.now();
		}
		if (completed == null) {
			completed = false;
		}
	}
}