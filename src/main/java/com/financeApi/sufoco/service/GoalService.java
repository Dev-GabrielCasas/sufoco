package com.financeApi.sufoco.service;

import com.financeApi.sufoco.dto.GoalProgressDTO;
import com.financeApi.sufoco.dto.GoalRequestDTO;
import com.financeApi.sufoco.exception.ResourceNotFoundException;
import com.financeApi.sufoco.model.Goal;
import com.financeApi.sufoco.model.UserModel;
import com.financeApi.sufoco.repository.GoalRepository;
import com.financeApi.sufoco.repository.TransactionRepository;
import com.financeApi.sufoco.security.AuthHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class GoalService {

    private final GoalRepository goalRepository;
    private final TransactionRepository transactionRepository;
    private final CategoryService categoryService;
    private final AuthHelper authHelper;

    public GoalService(GoalRepository goalRepository,
                       TransactionRepository transactionRepository,
                       CategoryService categoryService,
                       AuthHelper authHelper) {
        this.goalRepository = goalRepository;
        this.transactionRepository = transactionRepository;
        this.categoryService = categoryService;
        this.authHelper = authHelper;
    }

    public Goal create(GoalRequestDTO dto) {
        UserModel user = authHelper.getLoggedUser();

        goalRepository.findByUserAndCategoryIdAndMonthAndYear(
                        user, dto.categoryId(), dto.month(), dto.year())
                .ifPresent(g -> { throw new IllegalArgumentException(
                        "Já existe uma meta para essa categoria nesse mês."); });

        Goal goal = new Goal();
        goal.setLimitAmount(dto.limitAmount());
        goal.setMonth(dto.month());
        goal.setYear(dto.year());
        goal.setCategory(categoryService.getOrThrow(dto.categoryId()));
        goal.setUser(user);
        return goalRepository.save(goal);
    }

    public List<GoalProgressDTO> getProgress(int month, int year) {
        UserModel user = authHelper.getLoggedUser();
        List<Goal> goals = goalRepository.findByUserAndMonthAndYear(user, month, year);

        return goals.stream().map(goal -> {
            BigDecimal spent = transactionRepository
                    .sumMonthlyExpenseByCategory(user, year, month, goal.getCategory().getId());
            BigDecimal remaining = goal.getLimitAmount().subtract(spent);
            boolean exceeded = spent.compareTo(goal.getLimitAmount()) > 0;
            return new GoalProgressDTO(
                    goal.getId(),
                    goal.getCategory().getName(),
                    goal.getLimitAmount(),
                    spent,
                    remaining,
                    exceeded
            );
        }).toList();
    }

    public void delete(Long id) {
        UserModel user = authHelper.getLoggedUser();
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meta não encontrada."));
        if (!goal.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Meta não encontrada.");
        }
        goalRepository.delete(goal);
    }
}