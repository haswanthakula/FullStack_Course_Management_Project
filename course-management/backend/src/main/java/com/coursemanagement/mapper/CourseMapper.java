package com.coursemanagement.mapper;

import com.coursemanagement.dto.CourseDTO;
import com.coursemanagement.entity.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import java.util.List;

@Mapper(componentModel = "spring")
public interface CourseMapper {
	CourseMapper INSTANCE = Mappers.getMapper(CourseMapper.class);
	
	@Mapping(target = "id", source = "id")
	@Mapping(target = "title", source = "title")
	@Mapping(target = "description", source = "description")
	@Mapping(target = "instructor", source = "instructor")
	@Mapping(target = "category", source = "category")
	@Mapping(target = "level", source = "level")
	@Mapping(target = "price", source = "price")
	@Mapping(target = "enrollmentLimit", source = "enrollmentLimit")
	@Mapping(target = "language", source = "language")
	@Mapping(target = "createdAt", source = "createdAt")
	@Mapping(target = "updatedAt", source = "updatedAt")
	CourseDTO courseToDto(Course course);

	@Mapping(target = "id", source = "id")
	@Mapping(target = "title", source = "title")
	@Mapping(target = "description", source = "description")
	@Mapping(target = "instructor", source = "instructor")
	@Mapping(target = "category", source = "category")
	@Mapping(target = "level", source = "level")
	@Mapping(target = "price", source = "price")
	@Mapping(target = "enrollmentLimit", source = "enrollmentLimit")
	@Mapping(target = "language", source = "language")
	@Mapping(target = "createdAt", source = "createdAt")
	@Mapping(target = "updatedAt", source = "updatedAt")
	Course dtoToCourse(CourseDTO courseDTO);

	List<CourseDTO> coursesToDtos(List<Course> courses);
}