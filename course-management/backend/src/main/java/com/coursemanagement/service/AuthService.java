package com.coursemanagement.service;

import com.coursemanagement.dto.AuthRequest;
import com.coursemanagement.dto.UserDTO;
import com.coursemanagement.entity.User;
import com.coursemanagement.mapper.UserMapper;
import com.coursemanagement.repository.UserRepository;
import com.coursemanagement.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

	private final UserRepository userRepository;
	private final UserMapper userMapper;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;

	public UserDTO register(UserDTO userDTO) {
		log.info("Attempting to register user with email: {}", userDTO.getEmail());
		
		if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
			log.error("Email already registered: {}", userDTO.getEmail());
			throw new RuntimeException("Email already registered");
		}

		User user = userMapper.dtoToUser(userDTO);
		user.setId(UUID.randomUUID().toString());
		user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
		user.setCreatedAt(LocalDateTime.now());
		user.setUpdatedAt(LocalDateTime.now());

		// Check for admin email and set role accordingly
		if (userDTO.getEmail().equals("admin@coursemanagement.com")) {
			user.setRole("ROLE_ADMIN");
		} else {
			user.setRole("ROLE_STUDENT"); // Default role
		}

		User savedUser = userRepository.save(user);
		log.info("Successfully registered user with email: {}", userDTO.getEmail());
		return userMapper.userToDto(savedUser);
	}

	public String login(AuthRequest request) {
		try {
			log.info("Attempting authentication for user: {}", request.getEmail());
			
			authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
			);

			User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new RuntimeException("User not found"));
				
			log.info("Authentication successful for user: {}", request.getEmail());
			return jwtService.generateToken(user);
		} catch (Exception e) {
			log.error("Authentication failed for user: {}, error: {}", request.getEmail(), e.getMessage());
			throw new RuntimeException("Invalid credentials");
		}
	}
}