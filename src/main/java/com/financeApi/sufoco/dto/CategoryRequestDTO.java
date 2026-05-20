package com.financeApi.sufoco.dto;

import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;

public record CategoryRequestDTO(
        @NotBlank
        @Size(max = 30)
        String name
) {}