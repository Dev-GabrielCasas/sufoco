package com.financeApi.sufoco.repository;

import com.financeApi.sufoco.model.Category;
import com.financeApi.sufoco.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUser(UserModel user);
    Optional<Category> findByIdAndUser(Long id, UserModel user);
}