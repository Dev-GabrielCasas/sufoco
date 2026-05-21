package com.financeApi.sufoco;

import com.financeApi.sufoco.dto.CategoryRequestDTO;
import com.financeApi.sufoco.dto.CategoryResponseDTO;
import com.financeApi.sufoco.exception.ResourceNotFoundException;
import com.financeApi.sufoco.model.Category;
import com.financeApi.sufoco.model.UserModel;
import com.financeApi.sufoco.repository.CategoryRepository;
import com.financeApi.sufoco.security.AuthHelper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.financeApi.sufoco.service.CategoryService;
import com.financeApi.sufoco.service.TransactionService;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository repository;

    @Mock
    private AuthHelper authHelper;

    @InjectMocks
    private CategoryService categoryService;

    private UserModel loggedUser;

    @BeforeEach
    void setUp() {
        loggedUser = new UserModel();
        loggedUser.setId(1L);
        loggedUser.setEmail("user@email.com");
    }

    // -------------------------------------------------------------------------
    // create()
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("criar categoria — nome novo — salva e retorna CategoryResponseDTO")
    void create_nomeNovo_retornaResponse() {
        CategoryRequestDTO dto = new CategoryRequestDTO("Lazer");

        Category saved = new Category();
        saved.setId(1L);
        saved.setName("Lazer");
        saved.setUser(loggedUser);

        when(authHelper.getLoggedUser()).thenReturn(loggedUser);
        when(repository.existsByNameAndUser("Lazer", loggedUser)).thenReturn(false);
        when(repository.save(any(Category.class))).thenReturn(saved);

        CategoryResponseDTO response = categoryService.create(dto);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.name()).isEqualTo("Lazer");
        verify(repository).save(any(Category.class));
    }

    @Test
    @DisplayName("criar categoria — nome duplicado — lança RuntimeException")
    void create_nomeDuplicado_lancaExcecao() {
        CategoryRequestDTO dto = new CategoryRequestDTO("Mercado");

        when(authHelper.getLoggedUser()).thenReturn(loggedUser);
        when(repository.existsByNameAndUser("Mercado", loggedUser)).thenReturn(true);

        assertThatThrownBy(() -> categoryService.create(dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Categoria já existe.");

        verify(repository, never()).save(any());
    }

    // -------------------------------------------------------------------------
    // getOrThrow()
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("getOrThrow — categoria não encontrada para o usuário — lança ResourceNotFoundException")
    void getOrThrow_categoriaNaoEncontrada_lancaExcecao() {
        when(authHelper.getLoggedUser()).thenReturn(loggedUser);
        when(repository.findByIdAndUser(99L, loggedUser)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.getOrThrow(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Categoria não encontrada.");
    }

    @Test
    @DisplayName("getOrThrow — categoria encontrada — retorna entidade")
    void getOrThrow_categoriaEncontrada_retornaCategoria() {
        Category category = new Category();
        category.setId(5L);
        category.setName("Saúde");
        category.setUser(loggedUser);

        when(authHelper.getLoggedUser()).thenReturn(loggedUser);
        when(repository.findByIdAndUser(5L, loggedUser)).thenReturn(Optional.of(category));

        Category result = categoryService.getOrThrow(5L);

        assertThat(result.getId()).isEqualTo(5L);
        assertThat(result.getName()).isEqualTo("Saúde");
    }
}