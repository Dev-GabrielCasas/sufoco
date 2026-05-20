package com.financeApi.sufoco.controller;

import com.financeApi.sufoco.dto.CategoryRequestDTO;
import com.financeApi.sufoco.dto.CategoryResponseDTO;
import com.financeApi.sufoco.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @PostMapping
    public CategoryResponseDTO create(@Valid @RequestBody CategoryRequestDTO dto) {
        return service.create(dto);
    }
    

    @GetMapping
    public List<CategoryResponseDTO> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public CategoryResponseDTO getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}