package com.financeApi.sufoco.service;

import com.financeApi.sufoco.dto.UserResponseDTO;
import com.financeApi.sufoco.dto.UserUpdateDTO;
import com.financeApi.sufoco.model.UserModel;
import com.financeApi.sufoco.repository.UserRepository;
import com.financeApi.sufoco.security.AuthHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final AuthHelper authHelper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(AuthHelper authHelper,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.authHelper = authHelper;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDTO getProfile() {
        return toResponse(authHelper.getLoggedUser());
    }

    public UserResponseDTO updateProfile(UserUpdateDTO dto) {
        UserModel user = authHelper.getLoggedUser();

        if (dto.name() != null && !dto.name().isBlank()) {
            user.setName(dto.name());
        }
        if (dto.address() != null) {
            user.setAddress(dto.address());
        }
        if (dto.photoUrl() != null) {
            user.setPhotoUrl(dto.photoUrl());
        }
        if (dto.newPassword() != null && !dto.newPassword().isBlank()) {
            if (dto.currentPassword() == null ||
                    !passwordEncoder.matches(dto.currentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Senha atual incorreta.");
            }
            user.setPassword(passwordEncoder.encode(dto.newPassword()));
        }

        return toResponse(userRepository.save(user));
    }

    private UserResponseDTO toResponse(UserModel user) {
        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAddress(),
                user.getPhotoUrl()
        );
    }
}