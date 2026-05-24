package com.financeApi.sufoco.dto;

import java.math.BigDecimal;
import java.util.List;

public record MonthlyReportDTO(
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal balance,
        List<CategorySummaryDTO> categories,
        int month,
        int year
) {}