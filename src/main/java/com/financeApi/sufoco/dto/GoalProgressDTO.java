package com.financeApi.sufoco.dto;

import java.math.BigDecimal;

public record GoalProgressDTO(
        Long goalId,
        String categoryName,
        BigDecimal limitAmount,
        BigDecimal spent,
        BigDecimal remaining,
        boolean exceeded
) {}