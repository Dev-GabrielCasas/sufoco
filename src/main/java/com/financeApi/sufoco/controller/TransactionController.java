package com.financeApi.sufoco.controller;

import com.financeApi.sufoco.dto.TransactionRequestDTO;
import com.financeApi.sufoco.dto.TransactionResponseDTO;
import com.financeApi.sufoco.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.financeApi.sufoco.model.TransactionType;
import java.time.LocalDate;

import com.financeApi.sufoco.dto.SummaryResponseDTO;

import com.financeApi.sufoco.dto.MonthlyReportDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @PostMapping
    public TransactionResponseDTO create(@Valid @RequestBody TransactionRequestDTO dto) {
        return service.create(dto);
    }

    @GetMapping
    public List<TransactionResponseDTO> getAll() {
        return service.findAll();
    }

    @GetMapping("/paged")
    public Page<TransactionResponseDTO> getAllPaged(
            @PageableDefault(size = 10, sort = "date", direction = Sort.Direction.DESC) Pageable pageable) {
        return service.findAllPaged(pageable);
    }

    @GetMapping("/filter")
    public List<TransactionResponseDTO> filter(
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {

        return service.findWithFilters(type, categoryId, startDate, endDate);
    }

    @GetMapping("/summary")
    public SummaryResponseDTO getSummary() {
        return service.getSummary();
    }

    @GetMapping("/report")
    public MonthlyReportDTO getMonthlyReport(
            @RequestParam int month,
            @RequestParam int year) {
        return service.getMonthlyReport(month, year);
    }

    @GetMapping("/{id}")
    public TransactionResponseDTO getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    public TransactionResponseDTO update(@PathVariable Long id, @Valid @RequestBody TransactionRequestDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}