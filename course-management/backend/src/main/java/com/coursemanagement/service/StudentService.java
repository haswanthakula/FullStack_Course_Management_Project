package com.coursemanagement.service;

import com.coursemanagement.dto.UserDTO;
import com.coursemanagement.entity.User;
import com.coursemanagement.mapper.UserMapper;
import com.coursemanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class StudentService {

	private final UserRepository userRepository;
	private final UserMapper userMapper;
	private final PasswordEncoder passwordEncoder;

	public UserDTO getStudentProfile(String id) {
		User student = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Student not found"));
		return userMapper.userToDto(student);
	}

	@Transactional
	public UserDTO updateStudentProfile(String id, UserDTO userDTO) {
		User student = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Student not found"));

		student.setName(userDTO.getName());
		student.setEmail(userDTO.getEmail());

		// Update password only if provided
		if (StringUtils.hasText(userDTO.getPassword())) {
			student.setPassword(passwordEncoder.encode(userDTO.getPassword()));
		}

		User updatedStudent = userRepository.save(student);
		return userMapper.userToDto(updatedStudent);
	}
}