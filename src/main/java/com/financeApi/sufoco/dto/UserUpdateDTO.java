package com.financeApi.sufoco.dto;

public record UserUpdateDTO(
        String name,
        String address,
        String photoUrl,
        String currentPassword,
        String newPassword
) {}