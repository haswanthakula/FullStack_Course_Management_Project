package com.coursemanagement.mapper;

import com.coursemanagement.dto.UserDTO;
import com.coursemanagement.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
	UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

	@Mapping(target = "id", source = "id")
	@Mapping(target = "name", source = "name")
	@Mapping(target = "email", source = "email")
	@Mapping(target = "password", source = "password")
	@Mapping(target = "role", source = "role")
	@Mapping(target = "createdAt", source = "createdAt")
	@Mapping(target = "updatedAt", source = "updatedAt")
	@Mapping(target = "authorities", ignore = true)
	@Mapping(target = "username", ignore = true)
	@Mapping(target = "accountNonExpired", ignore = true)
	@Mapping(target = "accountNonLocked", ignore = true)
	@Mapping(target = "credentialsNonExpired", ignore = true)
	@Mapping(target = "enabled", ignore = true)
	User dtoToUser(UserDTO userDTO);

	@Mapping(target = "id", source = "id")
	@Mapping(target = "name", source = "name")
	@Mapping(target = "email", source = "email")
	@Mapping(target = "role", source = "role")
	@Mapping(target = "createdAt", source = "createdAt")
	@Mapping(target = "updatedAt", source = "updatedAt")
	@Mapping(target = "password", ignore = true)
	UserDTO userToDto(User user);
}