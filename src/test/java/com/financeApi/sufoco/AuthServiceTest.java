package com.financeApi.sufoco;

import com.financeApi.sufoco.model.UserModel;
import com.financeApi.sufoco.repository.UserRepository;
import com.financeApi.sufoco.service.AuthService;
import com.financeApi.sufoco.service.CategoryService;
import com.financeApi.sufoco.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private AuthService authService;

    private UserModel user;

    @BeforeEach
    void setUp() {
        user = new UserModel();
        user.setEmail("teste@email.com");
        user.setPassword("hashed_password");
    }

    // -------------------------------------------------------------------------
    // login()
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("login válido — retorna token JWT")
    void login_comCredenciaisValidas_retornaToken() {
        when(userRepository.findByEmail("teste@email.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("senha123", "hashed_password")).thenReturn(true);
        when(jwtService.generateToken("teste@email.com")).thenReturn("jwt-token");

        String token = authService.login("teste@email.com", "senha123");

        assertThat(token).isEqualTo("jwt-token");
        verify(jwtService).generateToken("teste@email.com");
    }

    @Test
    @DisplayName("login inválido — email não encontrado — lança IllegalArgumentException")
    void login_emailNaoEncontrado_lancaExcecao() {
        when(userRepository.findByEmail("naoexiste@email.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login("naoexiste@email.com", "qualquer"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Email ou senha inválidos.");

        verify(jwtService, never()).generateToken(any());
    }

    @Test
    @DisplayName("login inválido — senha incorreta — lança IllegalArgumentException")
    void login_senhaIncorreta_lancaExcecao() {
        when(userRepository.findByEmail("teste@email.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("senhaErrada", "hashed_password")).thenReturn(false);

        assertThatThrownBy(() -> authService.login("teste@email.com", "senhaErrada"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Email ou senha inválidos.");

        verify(jwtService, never()).generateToken(any());
    }

    // -------------------------------------------------------------------------
    // register()
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("register — email duplicado — lança IllegalArgumentException")
    void register_emailDuplicado_lancaExcecao() {
        when(userRepository.findByEmail("teste@email.com")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.register("teste@email.com", "senha123"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Email já cadastrado.");

        verify(userRepository, never()).save(any());
        verify(categoryService, never()).createDefaultCategories(any());
    }

    @Test
    @DisplayName("register — email novo — salva usuário, cria categorias padrão e retorna token")
    void register_emailNovo_retornaToken() {
        when(userRepository.findByEmail("novo@email.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("senha123")).thenReturn("hashed_nova");
        when(jwtService.generateToken("novo@email.com")).thenReturn("jwt-novo");

        String token = authService.register("novo@email.com", "senha123");

        assertThat(token).isEqualTo("jwt-novo");
        verify(userRepository).save(any(UserModel.class));
        verify(categoryService).createDefaultCategories(any(UserModel.class));
    }
}