package com.skillgapanalyzer.service;

import com.skillgapanalyzer.dto.UserLoginDto;
import com.skillgapanalyzer.dto.UserRegisterDto;
import com.skillgapanalyzer.dto.UserResponseDto;
import com.skillgapanalyzer.entity.User;
import com.skillgapanalyzer.exception.InvalidCredentialsException;
import com.skillgapanalyzer.exception.ResourceAlreadyExistsException;
import com.skillgapanalyzer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

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
                .password(passwordEncoder.encode(registerDto.getPassword()))
                .build();

        User savedUser = userRepository.save(user);
        return mapToResponseDto(savedUser);
    }

    @Override
    public UserResponseDto loginUser(UserLoginDto loginDto) {
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

        String storedPassword = user.getPassword();
        boolean passwordMatches;

        // Fallback for legacy plain text passwords: BCrypt hashes start with $2a$, $2b$, or $2y$
        if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$")) {
            passwordMatches = passwordEncoder.matches(loginDto.getPassword(), storedPassword);
        } else {
            passwordMatches = storedPassword.equals(loginDto.getPassword());
        }

        if (!passwordMatches) {
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
