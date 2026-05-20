package com.financeApi.sufoco.service;

import com.financeApi.sufoco.dto.CategoryRequestDTO;
import com.financeApi.sufoco.dto.CategoryResponseDTO;
import com.financeApi.sufoco.exception.ResourceNotFoundException;
import com.financeApi.sufoco.model.Category;
import com.financeApi.sufoco.model.UserModel;
import com.financeApi.sufoco.repository.CategoryRepository;
import com.financeApi.sufoco.security.AuthHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository repository;
    private final AuthHelper authHelper;

    public CategoryService(CategoryRepository repository, AuthHelper authHelper) {
        this.repository = repository;
        this.authHelper = authHelper;
    }

    public CategoryResponseDTO create(CategoryRequestDTO dto) {
        UserModel user = authHelper.getLoggedUser();
        boolean exists = repository.existsByNameAndUser(dto.name(), user);
            if (exists) {
            throw new RuntimeException("Categoria já existe.");
            }
        Category category = new Category();
        category.setName(dto.name());
        category.setUser(user);
        return toResponse(repository.save(category));
    }

    public List<CategoryResponseDTO> findAll() {
        UserModel user = authHelper.getLoggedUser();
        return repository.findByUser(user).stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponseDTO findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    public void delete(Long id) {
        UserModel user = authHelper.getLoggedUser();
        Category category = repository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));
        repository.delete(category);
    }

    public CategoryResponseDTO update(Long id, CategoryRequestDTO dto) {

        Category category = getOrThrow(id);

        category.setName(dto.name());

        return toResponse(repository.save(category));
    }
    
    public Category getOrThrow(Long id) {
        UserModel user = authHelper.getLoggedUser();
        return repository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));
    }

    private CategoryResponseDTO toResponse(Category c) {
        return new CategoryResponseDTO(c.getId(), c.getName());
    }
}