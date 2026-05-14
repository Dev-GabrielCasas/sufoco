package com.financeApi.sufoco;

import com.financeApi.sufoco.dto.TransactionRequestDTO;
import com.financeApi.sufoco.dto.TransactionResponseDTO;
import com.financeApi.sufoco.exception.ResourceNotFoundException;
import com.financeApi.sufoco.model.Category;
import com.financeApi.sufoco.model.Transaction;
import com.financeApi.sufoco.model.TransactionType;
import com.financeApi.sufoco.model.UserModel;
import com.financeApi.sufoco.repository.TransactionRepository;
import com.financeApi.sufoco.security.AuthHelper;
import com.financeApi.sufoco.service.CategoryService;
import com.financeApi.sufoco.service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TransactionServiceTest {

    @Mock
    private TransactionRepository repository;

    @Mock
    private CategoryService categoryService;

    @Mock
    private AuthHelper authHelper;

    @InjectMocks
    private TransactionService service;

    private UserModel user;
    private Category category;
    private Transaction transaction;
    private TransactionRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new UserModel();
        user.setId(1L);
        user.setEmail("gabriel@teste.com");

        category = new Category();
        category.setId(1L);
        category.setName("Alimentação");
        category.setUser(user);

        transaction = new Transaction();
        transaction.setId(1L);
        transaction.setDescription("Mercado");
        transaction.setAmount(new BigDecimal("150.00"));
        transaction.setDate(LocalDate.now());
        transaction.setType(TransactionType.EXPENSE);
        transaction.setCategory(category);
        transaction.setUser(user);

        requestDTO = new TransactionRequestDTO(
                "Mercado",
                new BigDecimal("150.00"),
                LocalDate.now(),
                TransactionType.EXPENSE,
                1L
        );

        when(authHelper.getLoggedUser()).thenReturn(user);
    }

    @Test
    void deveCriarTransacaoComSucesso() {
        when(categoryService.getOrThrow(1L)).thenReturn(category);
        when(repository.save(any())).thenReturn(transaction);

        TransactionResponseDTO response = service.create(requestDTO);

        assertNotNull(response);
        assertEquals("Mercado", response.description());
        assertEquals(new BigDecimal("150.00"), response.amount());
        verify(repository, times(1)).save(any());
    }

    @Test
    void deveLancarExcecaoQuandoValorForZero() {
        TransactionRequestDTO dtoInvalido = new TransactionRequestDTO(
                "Mercado",
                BigDecimal.ZERO,
                LocalDate.now(),
                TransactionType.EXPENSE,
                1L
        );

        assertThrows(IllegalArgumentException.class, () -> service.create(dtoInvalido));
        verify(repository, never()).save(any());
    }

    @Test
    void deveRetornarTodasAsTransacoes() {
        when(repository.findByUser(user)).thenReturn(List.of(transaction));

        List<TransactionResponseDTO> result = service.findAll();

        assertEquals(1, result.size());
        assertEquals("Mercado", result.get(0).description());
    }

    @Test
    void deveLancarExcecaoQuandoTransacaoNaoEncontrada() {
        when(repository.findByIdAndUser(99L, user)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.findById(99L));
    }

    @Test
    void deveDeletarTransacaoComSucesso() {
        when(repository.findByIdAndUser(1L, user)).thenReturn(Optional.of(transaction));
        doNothing().when(repository).delete(transaction);

        assertDoesNotThrow(() -> service.delete(1L));
        verify(repository, times(1)).delete(transaction);
    }
}