package com.coursemanagement.mapper;

import com.coursemanagement.dto.CourseDTO;
import com.coursemanagement.entity.Course;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-04-05T18:20:06+0530",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.42.0.z20250331-1358, environment: Java 21.0.6 (Eclipse Adoptium)"
)
@Component
public class CourseMapperImpl implements CourseMapper {

    @Override
    public CourseDTO courseToDto(Course course) {
        if ( course == null ) {
            return null;
        }

        CourseDTO courseDTO = new CourseDTO();

        courseDTO.setId( course.getId() );
        courseDTO.setTitle( course.getTitle() );
        courseDTO.setDescription( course.getDescription() );
        courseDTO.setInstructor( course.getInstructor() );
        courseDTO.setCategory( course.getCategory() );
        courseDTO.setLevel( course.getLevel() );
        courseDTO.setPrice( course.getPrice() );
        courseDTO.setEnrollmentLimit( course.getEnrollmentLimit() );
        courseDTO.setLanguage( course.getLanguage() );
        courseDTO.setCreatedAt( course.getCreatedAt() );
        courseDTO.setUpdatedAt( course.getUpdatedAt() );

        return courseDTO;
    }

    @Override
    public Course dtoToCourse(CourseDTO courseDTO) {
        if ( courseDTO == null ) {
            return null;
        }

        Course course = new Course();

        course.setId( courseDTO.getId() );
        course.setTitle( courseDTO.getTitle() );
        course.setDescription( courseDTO.getDescription() );
        course.setInstructor( courseDTO.getInstructor() );
        course.setCategory( courseDTO.getCategory() );
        course.setLevel( courseDTO.getLevel() );
        course.setPrice( courseDTO.getPrice() );
        course.setEnrollmentLimit( courseDTO.getEnrollmentLimit() );
        course.setLanguage( courseDTO.getLanguage() );
        course.setCreatedAt( courseDTO.getCreatedAt() );
        course.setUpdatedAt( courseDTO.getUpdatedAt() );

        return course;
    }

    @Override
    public List<CourseDTO> coursesToDtos(List<Course> courses) {
        if ( courses == null ) {
            return null;
        }

        List<CourseDTO> list = new ArrayList<CourseDTO>( courses.size() );
        for ( Course course : courses ) {
            list.add( courseToDto( course ) );
        }

        return list;
    }
}
