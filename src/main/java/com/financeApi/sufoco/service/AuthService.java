package com.financeApi.sufoco.service;

import com.financeApi.sufoco.model.UserModel;
import com.financeApi.sufoco.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CategoryService categoryService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       CategoryService categoryService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.categoryService = categoryService;}

    public String register(String email, String password) {
        System.out.println("REGISTER EMAIL: " + email);
        System.out.println("REGISTER PASSWORD: " + password);

        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email já cadastrado.");
        }
        UserModel user = new UserModel();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        categoryService.createDefaultCategories(user);
        return jwtService.generateToken(email);
    }

    public String login(String email, String password) {
        UserModel user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Email ou senha inválidos."));
        
        System.out.println("LOGIN EMAIL: " + email);
        System.out.println("LOGIN PASSWORD: " + password);
        System.out.println("HASH NO BANCO: " + user.getPassword());

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Email ou senha inválidos.");
        }
        return jwtService.generateToken(email);
    }
 }
