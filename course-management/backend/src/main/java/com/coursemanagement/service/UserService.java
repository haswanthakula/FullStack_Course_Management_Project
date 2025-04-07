package com.coursemanagement.service;

import com.coursemanagement.dto.UserDTO;
import com.coursemanagement.entity.User;
import com.coursemanagement.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;


	public void updateProfile(String userId, UserDTO userDTO) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		user.setName(userDTO.getName());
		userRepository.save(user);
	}

	public void updatePassword(String userId, String oldPassword, String newPassword) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));

		if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
			throw new RuntimeException("Current password is incorrect");
		}

		user.setPassword(passwordEncoder.encode(newPassword));
		userRepository.save(user);
	}
}