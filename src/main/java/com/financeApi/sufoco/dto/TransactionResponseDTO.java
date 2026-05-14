package com.financeApi.sufoco.dto;

import com.financeApi.sufoco.model.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionResponseDTO(
        Long id,
        String description,
        BigDecimal amount,
        LocalDate date,
        TransactionType type,
        String categoryName
) {}