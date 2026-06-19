package com.skillgapanalyzer.service;

import com.skillgapanalyzer.dto.UserLoginDto;
import com.skillgapanalyzer.dto.UserRegisterDto;
import com.skillgapanalyzer.dto.UserResponseDto;

import java.util.List;

public interface UserService {
    UserResponseDto registerUser(UserRegisterDto registerDto);
    UserResponseDto loginUser(UserLoginDto loginDto);
    List<UserResponseDto> getAllUsers();
}
