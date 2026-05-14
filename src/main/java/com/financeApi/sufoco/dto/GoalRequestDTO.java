package com.financeApi.sufoco.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record GoalRequestDTO(
        @NotNull Long categoryId,
        @NotNull @Positive BigDecimal limitAmount,
        @NotNull Integer month,
        @NotNull Integer year
) {}