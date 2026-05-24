package com.financeApi.sufoco.controller;

import com.financeApi.sufoco.dto.UserResponseDTO;
import com.financeApi.sufoco.dto.UserUpdateDTO;
import com.financeApi.sufoco.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getProfile() {
        return ResponseEntity.ok(userService.getProfile());
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponseDTO> updateProfile(@RequestBody UserUpdateDTO dto) {
        return ResponseEntity.ok(userService.updateProfile(dto));
    }
}