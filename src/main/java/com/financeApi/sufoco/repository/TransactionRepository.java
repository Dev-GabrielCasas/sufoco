package com.financeApi.sufoco.repository;

import com.financeApi.sufoco.model.Transaction;
import com.financeApi.sufoco.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

import com.financeApi.sufoco.model.TransactionType;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;

import java.math.BigDecimal;
import com.financeApi.sufoco.dto.CategorySummaryDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(UserModel user);
    Page<Transaction> findByUser(UserModel user, Pageable pageable);
    Optional<Transaction> findByIdAndUser(Long id, UserModel user);

    @Query("""
    SELECT t FROM Transaction t
    WHERE t.user = :user
    AND (:type IS NULL OR t.type = :type)
    AND (:categoryId IS NULL OR t.category.id = :categoryId)
    AND (:startDate IS NULL OR t.date >= :startDate)
    AND (:endDate IS NULL OR t.date <= :endDate)
""")
    List<Transaction> findWithFilters(
            @Param("user") UserModel user,
            @Param("type") TransactionType type,
            @Param("categoryId") Long categoryId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = 'INCOME'")
    BigDecimal sumIncomeByUser(@Param("user") UserModel user);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = 'EXPENSE'")
    BigDecimal sumExpenseByUser(@Param("user") UserModel user);

    @Query("""
    SELECT new com.financeApi.sufoco.dto.CategorySummaryDTO(
        t.category.name, SUM(t.amount)
    )
    FROM Transaction t
    WHERE t.user = :user
    AND t.type = 'EXPENSE'
    AND YEAR(t.date) = :year
    AND MONTH(t.date) = :month
    GROUP BY t.category.name
""")
    List<CategorySummaryDTO> sumExpenseByCategory(
            @Param("user") UserModel user,
            @Param("year") int year,
            @Param("month") int month
    );

    @Query("""
    SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t
    WHERE t.user = :user AND t.type = 'INCOME'
    AND YEAR(t.date) = :year AND MONTH(t.date) = :month
""")
    BigDecimal sumMonthlyIncome(
            @Param("user") UserModel user,
            @Param("year") int year,
            @Param("month") int month
    );

    @Query("""
    SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t
    WHERE t.user = :user AND t.type = 'EXPENSE'
    AND YEAR(t.date) = :year AND MONTH(t.date) = :month
""")
    BigDecimal sumMonthlyExpense(
            @Param("user") UserModel user,
            @Param("year") int year,
            @Param("month") int month
    );

    @Query("""
    SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t
    WHERE t.user = :user AND t.type = 'EXPENSE'
    AND YEAR(t.date) = :year AND MONTH(t.date) = :month
    AND t.category.id = :categoryId
""")
    BigDecimal sumMonthlyExpenseByCategory(
            @Param("user") UserModel user,
            @Param("year") int year,
            @Param("month") int month,
            @Param("categoryId") Long categoryId
    );

}
