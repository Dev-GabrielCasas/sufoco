package com.financeApi.sufoco.dto;

import java.math.BigDecimal;

public record CategorySummaryDTO(
        String categoryName,
        BigDecimal total
) {}