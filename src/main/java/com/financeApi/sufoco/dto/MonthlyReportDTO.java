package com.financeApi.sufoco.dto;

import java.math.BigDecimal;
import java.util.List;

public record MonthlyReportDTO(
        int month,
        int year,
        List<CategorySummaryDTO> categories,
        BigDecimal totalExpense,
        BigDecimal totalIncome,
        BigDecimal balance
) {}