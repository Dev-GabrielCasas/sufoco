# 💸 Sufoco — API de Finanças Pessoais

API REST para controle de finanças pessoais, desenvolvida com Spring Boot. Permite gerenciar transações, categorias e gerar relatórios financeiros mensais com autenticação via JWT.

---

## 🚀 Tecnologias

- Java 22
- Spring Boot 3.3.5
- Spring Security + JWT (jjwt 0.12.6)
- Spring Data JPA + Hibernate
- MySQL
- Lombok
- SpringDoc OpenAPI (Swagger UI)
- JUnit 5 + Mockito + AssertJ

---

## Como rodar localmente

### Pré-requisitos

- Java 22+
- MySQL rodando localmente
- Maven (ou usar o `mvnw` incluso no projeto)

### 1. Clone o repositório

```bash
git clone https://github.com/Dev-GabrielCasas/sufoco.git
cd sufoco
```

### 2. Configure o banco de dados

Crie um banco MySQL:

```sql
CREATE DATABASE sufoco;
```

### 3. Configure o `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sufoco
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.open-in-view=false

jwt.secret=sua_chave_secreta
```

### 4. Rode a aplicação

```bash
./mvnw spring-boot:run
```

A API estará disponível em `http://localhost:8080`

### 5. Acesse o Swagger

```
http://localhost:8080/swagger-ui/index.html
```

---

## 🔐 Autenticação

A API utiliza JWT. Para acessar os endpoints protegidos, é necessário se registrar ou fazer login e incluir o token no header:

```
Authorization: Bearer {seu_token}
```

### Endpoints de Auth

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/register` | Cadastra um novo usuário |
| POST | `/auth/login` | Autentica e retorna o token JWT |

#### Exemplo — Register

```json
POST /auth/register
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

#### Exemplo — Login

```json
POST /auth/login
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

> Ao se registrar, 10 categorias padrão são criadas automaticamente para o usuário (Mercado, Casa, Transporte, Saúde, etc).

---

## 💳 Transações

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/transactions` | Cria uma transação |
| GET | `/transactions` | Lista todas as transações do usuário |
| GET | `/transactions/{id}` | Busca transação por ID |
| PUT | `/transactions/{id}` | Atualiza uma transação |
| DELETE | `/transactions/{id}` | Remove uma transação |
| GET | `/transactions/filter` | Filtra transações por tipo, categoria e período |
| GET | `/transactions/summary` | Resumo financeiro (total receitas, despesas e saldo) |
| GET | `/transactions/monthly-report` | Relatório mensal detalhado por categoria |

#### Exemplo — Criar transação

```json
POST /transactions
{
  "description": "Compras no mercado",
  "amount": 150.00,
  "date": "2026-05-20",
  "type": "EXPENSE",
  "categoryId": 1
}
```

Os tipos aceitos são `INCOME` (receita) e `EXPENSE` (despesa).

---

## 🗂️ Categorias

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/categories` | Cria uma categoria |
| GET | `/categories` | Lista categorias do usuário |
| GET | `/categories/{id}` | Busca categoria por ID |
| PUT | `/categories/{id}` | Atualiza uma categoria |
| DELETE | `/categories/{id}` | Remove uma categoria |

#### Exemplo — Criar categoria

```json
POST /categories
{
  "name": "Streaming"
}
```

> Cada usuário só enxerga suas próprias categorias. Nomes duplicados por usuário não são permitidos.

---

## 🏗️ Arquitetura

```
src/
├── main/
│   └── java/com/financeApi/sufoco/
│       ├── controller/       # Camada HTTP (endpoints REST)
│       ├── service/          # Regras de negócio
│       ├── repository/       # Acesso ao banco (Spring Data JPA)
│       ├── model/            # Entidades JPA
│       ├── dto/              # Objetos de transferência de dados
│       ├── exception/        # Exceções customizadas
│       └── security/         # JWT, AuthHelper, filtros de segurança
└── test/
    └── java/com/financeApi/sufoco/
        ├── AuthServiceTest.java
        ├── CategoryServiceTest.java
        └── TransactionServiceTest.java
```

### Fluxo de autenticação

```
Request → JwtFilter → valida token → injeta usuário no contexto
                                          ↓
                                    AuthHelper.getLoggedUser()
                                          ↓
                                    Service opera só com dados do usuário logado
```

---

## 🧪 Testes

O projeto possui testes unitários cobrindo os principais cenários de negócio.

```bash
./mvnw test
```

### Cobertura atual

| Classe | Cenários testados |
|--------|-------------------|
| `AuthService` | Login válido, login com email inválido, login com senha errada, registro com email duplicado, registro com sucesso |
| `TransactionService` | Criar transação, valor zero/negativo, categoria inexistente, acesso a transação de outro usuário, findAll, delete |
| `CategoryService` | Criar categoria, categoria duplicada, categoria não encontrada, busca com sucesso |

**14 testes — 0 falhas**

---

## 📌 Observações

- Todos os dados são isolados por usuário — um usuário nunca acessa dados de outro
- A paginação está disponível em `GET /transactions` via parâmetros `page` e `size`
- O Swagger documenta todos os endpoints com exemplos interativos em `/swagger-ui/index.html`
