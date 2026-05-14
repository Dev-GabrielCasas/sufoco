package com.financeApi.sufoco.dto;

import com.financeApi.sufoco.model.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionRequestDTO(
        @NotBlank String description,
        @NotNull @Positive BigDecimal amount,
        @NotNull LocalDate date,
        @NotNull TransactionType type,
        @NotNull Long categoryId
) {}