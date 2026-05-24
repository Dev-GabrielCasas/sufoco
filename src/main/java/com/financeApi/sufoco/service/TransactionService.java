package com.financeApi.sufoco.service;

import com.financeApi.sufoco.dto.TransactionRequestDTO;
import com.financeApi.sufoco.dto.TransactionResponseDTO;
import com.financeApi.sufoco.exception.ResourceNotFoundException;
import com.financeApi.sufoco.model.Transaction;
import com.financeApi.sufoco.model.UserModel;
import com.financeApi.sufoco.repository.TransactionRepository;
import com.financeApi.sufoco.security.AuthHelper;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

import com.financeApi.sufoco.model.TransactionType;
import java.time.LocalDate;

import com.financeApi.sufoco.dto.SummaryResponseDTO;

import com.financeApi.sufoco.dto.CategorySummaryDTO;
import com.financeApi.sufoco.dto.MonthlyReportDTO;

//service ja validando o token do usuário
@Service
public class TransactionService {

    private final TransactionRepository repository;
    private final CategoryService categoryService;
    private final AuthHelper authHelper;

    public TransactionService(TransactionRepository repository,
                              CategoryService categoryService,
                              AuthHelper authHelper) {
        this.repository = repository;
        this.categoryService = categoryService;
        this.authHelper = authHelper;
    }

    //criando uma transação
    public TransactionResponseDTO create(TransactionRequestDTO dto) {
        if (dto.amount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }
        UserModel user = authHelper.getLoggedUser();
        Transaction t = new Transaction();
        t.setDescription(dto.description());
        t.setAmount(dto.amount());
        t.setDate(dto.date());
        t.setType(dto.type());
        t.setCategory(categoryService.getOrThrow(dto.categoryId()));
        t.setUser(user);
        return toResponse(repository.save(t));
    }

    //busca todas as transações
    public List<TransactionResponseDTO> findAll() {
        UserModel user = authHelper.getLoggedUser();
        return repository.findByUser(user).stream()
                .map(this::toResponse)
                .toList();
    }

    //busca a transação pelo id
    public TransactionResponseDTO findById(Long id) {
        UserModel user = authHelper.getLoggedUser();
        Transaction t = repository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transação não encontrada."));
        return toResponse(t);
    }

    //procura a transação pelo id e altera os dados
    public TransactionResponseDTO update(Long id, TransactionRequestDTO dto) {
        UserModel user = authHelper.getLoggedUser();
        Transaction t = repository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transação não encontrada."));
        t.setDescription(dto.description());
        t.setAmount(dto.amount());
        t.setDate(dto.date());
        t.setType(dto.type());
        t.setCategory(categoryService.getOrThrow(dto.categoryId()));
        return toResponse(repository.save(t));
    }

    //deletar transação
    public void delete(Long id) {
        UserModel user = authHelper.getLoggedUser();
        Transaction t = repository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transação não encontrada."));
        repository.delete(t);
    }

    //busca com filtros para as transações
    public List<TransactionResponseDTO> findWithFilters(
            TransactionType type,
            Long categoryId,
            LocalDate startDate,
            LocalDate endDate) {

        UserModel user = authHelper.getLoggedUser();
        return repository.findWithFilters(user, type, categoryId, startDate, endDate)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    //gera o resumo financeiro
    public SummaryResponseDTO getSummary() {
        UserModel user = authHelper.getLoggedUser();
        BigDecimal totalIncome = repository.sumIncomeByUser(user);
        BigDecimal totalExpense = repository.sumExpenseByUser(user);
        BigDecimal balance = totalIncome.subtract(totalExpense);
        return new SummaryResponseDTO(totalIncome, totalExpense, balance);
    }

    //gera o resumo financeiro do mês
    public MonthlyReportDTO getMonthlyReport(int month, int year) {
        UserModel user = authHelper.getLoggedUser();
        List<CategorySummaryDTO> categories = repository.sumExpenseByCategory(user, year, month);
        BigDecimal totalIncome = repository.sumMonthlyIncome(user, year, month);
        BigDecimal totalExpense = repository.sumMonthlyExpense(user, year, month);
        BigDecimal balance = totalIncome.subtract(totalExpense);
        return new MonthlyReportDTO(totalIncome,totalExpense, balance, categories,month, year);
    }

    public Page<TransactionResponseDTO> findAllPaged(Pageable pageable) {
        UserModel user = authHelper.getLoggedUser();
        return repository.findByUser(user, pageable)
                .map(this::toResponse);
    }

    private TransactionResponseDTO toResponse(Transaction t) {
        return new TransactionResponseDTO(
                t.getId(),
                t.getDescription(),
                t.getAmount(),
                t.getDate(),
                t.getType(),
                t.getCategory() != null ? t.getCategory().getName() : null
        );
    }

}