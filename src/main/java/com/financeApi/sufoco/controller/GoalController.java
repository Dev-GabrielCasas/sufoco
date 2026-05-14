package com.financeApi.sufoco.controller;

import com.financeApi.sufoco.dto.GoalProgressDTO;
import com.financeApi.sufoco.dto.GoalRequestDTO;
import com.financeApi.sufoco.model.Goal;
import com.financeApi.sufoco.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goals")
public class GoalController {

    private final GoalService service;

    public GoalController(GoalService service) {
        this.service = service;
    }

    @PostMapping
    public Goal create(@Valid @RequestBody GoalRequestDTO dto) {
        return service.create(dto);
    }

    @GetMapping("/progress")
    public List<GoalProgressDTO> getProgress(
            @RequestParam int month,
            @RequestParam int year) {
        return service.getProgress(month, year);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}