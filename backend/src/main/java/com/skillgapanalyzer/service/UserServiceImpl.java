package com.skillgapanalyzer.service;

import com.skillgapanalyzer.dto.UserLoginDto;
import com.skillgapanalyzer.dto.UserRegisterDto;
import com.skillgapanalyzer.dto.UserResponseDto;
import com.skillgapanalyzer.entity.User;
import com.skillgapanalyzer.exception.InvalidCredentialsException;
import com.skillgapanalyzer.exception.ResourceAlreadyExistsException;
import com.skillgapanalyzer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponseDto registerUser(UserRegisterDto registerDto) {
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new ResourceAlreadyExistsException("A user with email " + registerDto.getEmail() + " already exists.");
        }

        User user = User.builder()
                .fullName(registerDto.getFullName())
                .email(registerDto.getEmail())
                .password(registerDto.getPassword()) // Storing plain text password for this mock setup
                .build();

        User savedUser = userRepository.save(user);
        return mapToResponseDto(savedUser);
    }

    @Override
    public UserResponseDto loginUser(UserLoginDto loginDto) {
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

        if (!user.getPassword().equals(loginDto.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        return mapToResponseDto(user);
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    private UserResponseDto mapToResponseDto(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }
}
