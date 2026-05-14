package com.financeApi.sufoco.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
@Entity

public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome da categoria não pode ser vazio.")
    private String name;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserModel user;
}
