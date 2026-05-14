package com.financeApi.sufoco.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 400 - Dados inválidos na requisição
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        String field = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .findFirst()
                .orElse("Campo inválido.");
        return buildResponse(HttpStatus.BAD_REQUEST,
                "Dados inválidos na requisição.",
                field);
    }

    // 400 - Argumento de negócio inválido
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST,
                "Requisição inválida.",
                ex.getMessage());
    }

    // 400 - JSON malformado ou tipo errado no body
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleUnreadableMessage(HttpMessageNotReadableException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST,
                "Corpo da requisição inválido ou malformado.",
                "Verifique o formato do JSON enviado.");
    }

    // 400 - Tipo errado no parâmetro da URL (ex: texto onde esperava número)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST,
                "Tipo de parâmetro inválido.",
                "O parâmetro '" + ex.getName() + "' recebeu um valor inválido.");
    }

    // 400 - Parâmetro obrigatório ausente na URL
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Map<String, Object>> handleMissingParam(MissingServletRequestParameterException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST,
                "Parâmetro obrigatório ausente.",
                "O parâmetro '" + ex.getParameterName() + "' é obrigatório.");
    }

    // 403 - Acesso negado
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        return buildResponse(HttpStatus.FORBIDDEN,
                "Acesso negado.",
                "Você não tem permissão para acessar este recurso.");
    }

    // 404 - Recurso não encontrado no banco
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND,
                "Recurso não encontrado.",
                ex.getMessage());
    }

    // 404 - Rota não existe
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Map<String, Object>> handleRouteNotFound(NoResourceFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND,
                "Rota não encontrada.",
                "O endpoint '" + ex.getResourcePath() + "' não existe nesta API.");
    }

    // 500 - Erro genérico não tratado
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                "Erro interno do servidor.",
                "Ocorreu um erro inesperado. Tente novamente mais tarde.");
    }

    private ResponseEntity<Map<String, Object>> buildResponse(
            HttpStatus status, String error, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status.value());
        body.put("error", error);
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}