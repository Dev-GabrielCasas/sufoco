package com.financeApi.sufoco.repository;

import com.financeApi.sufoco.model.Goal;
import com.financeApi.sufoco.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUserAndMonthAndYear(UserModel user, int month, int year);
    Optional<Goal> findByUserAndCategoryIdAndMonthAndYear(UserModel user, Long categoryId, int month, int year);
}