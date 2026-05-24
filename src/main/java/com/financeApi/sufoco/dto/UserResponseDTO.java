package com.financeApi.sufoco.dto;

public record UserResponseDTO(
        Long id,
        String name,
        String email,
        String address,
        String photoUrl
) {}