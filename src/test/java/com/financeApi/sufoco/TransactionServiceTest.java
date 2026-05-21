package com.financeApi.sufoco;

import com.financeApi.sufoco.dto.TransactionRequestDTO;
import com.financeApi.sufoco.dto.TransactionResponseDTO;
import com.financeApi.sufoco.exception.ResourceNotFoundException;
import com.financeApi.sufoco.model.*;
import com.financeApi.sufoco.repository.TransactionRepository;
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


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;


import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository repository;

    @Mock
    private
    CategoryService categoryService;

    @Mock
    private AuthHelper authHelper;

    @InjectMocks
    private TransactionService transactionService;

    private UserModel loggedUser;
    private UserModel otherUser;
    private Category category;

    @BeforeEach
    void setUp() {
        loggedUser = new UserModel();
        loggedUser.setId(1L);
        loggedUser.setEmail("user@email.com");

        otherUser = new UserModel();
        otherUser.setId(2L);
        otherUser.setEmail("outro@email.com");

        category = new Category();
        category.setId(10L);
        category.setName("Mercado");
    }

    // -------------------------------------------------------------------------
    // create()
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("criar transaction — dados válidos — retorna TransactionResponseDTO")
    void create_dadosValidos_retornaResponse() {
        TransactionRequestDTO dto = new TransactionRequestDTO(
                "Compras no mercado",
                new BigDecimal("150.00"),
                LocalDate.now(),
                TransactionType.EXPENSE,
                10L
        );

        Transaction saved = new Transaction();
        saved.setId(1L);
        saved.setDescription(dto.description());
        saved.setAmount(dto.amount());
        saved.setDate(dto.date());
        saved.setType(dto.type());
        saved.setCategory(category);
        saved.setUser(loggedUser);

        when(authHelper.getLoggedUser()).thenReturn(loggedUser);
        when(categoryService.getOrThrow(10L)).thenReturn(category);
        when(repository.save(any(Transaction.class))).thenReturn(saved);

        TransactionResponseDTO response = transactionService.create(dto);

        assertThat(response).isNotNull();
        assertThat(response.description()).isEqualTo("Compras no mercado");
        assertThat(response.amount()).isEqualByComparingTo("150.00");
        assertThat(response.categoryName()).isEqualTo("Mercado");

        verify(repository).save(any(Transaction.class));
    }

    @Test
    @DisplayName("criar transaction — valor zero ou negativo — lança IllegalArgumentException")
    void create_valorZeroOuNegativo_lancaExcecao() {
        TransactionRequestDTO dto = new TransactionRequestDTO(
                "Inválida",
                BigDecimal.ZERO,
                LocalDate.now(),
                TransactionType.EXPENSE,
                10L
        );

        assertThatThrownBy(() -> transactionService.create(dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Valor deve ser maior que zero.");

        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("criar transaction — category inexistente — lança ResourceNotFoundException")
    void create_categoryInexistente_lancaExcecao() {
        TransactionRequestDTO dto = new TransactionRequestDTO(
                "Teste",
                new BigDecimal("50.00"),
                LocalDate.now(),
                TransactionType.EXPENSE,
                99L
        );

        when(authHelper.getLoggedUser()).thenReturn(loggedUser);
        when(categoryService.getOrThrow(99L))
                .thenThrow(new ResourceNotFoundException("Categoria não encontrada."));

        assertThatThrownBy(() -> transactionService.create(dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Categoria não encontrada.");

        verify(repository, never()).save(any());
    }

    // -------------------------------------------------------------------------
    // findById() — acesso de outro usuário
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("findById — usuário acessando transaction de outro user — lança ResourceNotFoundException")
    void findById_transactionDeOutroUsuario_lancaExcecao() {
        // O usuário logado é "loggedUser", mas a transaction pertence a "otherUser".
        // O repository já filtra por user, portanto retorna empty quando não bate.
        when(authHelper.getLoggedUser()).thenReturn(loggedUser);
        when(repository.findByIdAndUser(42L, loggedUser)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> transactionService.findById(42L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Transação não encontrada.");
    }

    @Test
    @DisplayName("findById — transação do próprio usuário — retorna response")
    void findById_transacaoDoProprioUsuario_retornaResponse() {
        Transaction t = new Transaction();
        t.setId(5L);
        t.setDescription("Salário");
        t.setAmount(new BigDecimal("3000.00"));
        t.setDate(LocalDate.now());
        t.setType(TransactionType.INCOME);
        t.setCategory(category);
        t.setUser(loggedUser);

        when(authHelper.getLoggedUser()).thenReturn(loggedUser);
        when(repository.findByIdAndUser(5L, loggedUser)).thenReturn(Optional.of(t));

        TransactionResponseDTO response = transactionService.findById(5L);

        assertThat(response.id()).isEqualTo(5L);
        assertThat(response.description()).isEqualTo("Salário");
    }
}