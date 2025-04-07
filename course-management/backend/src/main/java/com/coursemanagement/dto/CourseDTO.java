package com.coursemanagement.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
	private String id;
	private String title;
	private String description;
	private String instructor;
	private String category;
	private String level;
	private Double price;
	private Integer enrollmentLimit;
	private String language;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}