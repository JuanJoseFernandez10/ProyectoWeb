package com.groovelink.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFound(ResourceNotFoundException ex) {
        return buildErrorResponse(ex, ex.getStatus());
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Object> handleBusinessException(BusinessException ex) {
        return buildErrorResponse(ex, ex.getStatus());
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Object> handleDuplicateResource(DuplicateResourceException ex) {
        return buildErrorResponse(ex, ex.getStatus());
    }

    @ExceptionHandler(UnauthorizedActionException.class)
    public ResponseEntity<Object> handleUnauthorizedAction(UnauthorizedActionException ex) {
        return buildErrorResponse(ex, ex.getStatus());
    }

    @ExceptionHandler(InvalidOperationException.class)
    public ResponseEntity<Object> handleInvalidOperation(InvalidOperationException ex) {
        return buildErrorResponse(ex, ex.getStatus());
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Object> handleNoResourceFound(NoResourceFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", "La ruta solicitada no existe.");
        body.put("errorCode", "NOT_FOUND");
        body.put("status", HttpStatus.NOT_FOUND.value());

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Object> handleAuthenticationException(AuthenticationException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", "No pudimos iniciar sesion. Verifica tu usuario y contrasena.");
        body.put("errorCode", "UNAUTHORIZED");
        body.put("status", HttpStatus.UNAUTHORIZED.value());

        return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        Map<String, Object> body = new HashMap<>();
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        Map<String, String> fieldLabels = new LinkedHashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            if (!fieldErrors.containsKey(error.getField())) {
                fieldErrors.put(error.getField(), error.getDefaultMessage());
                fieldLabels.put(error.getField(), toFriendlyFieldName(error.getField()));
            }
        });

        body.put("timestamp", LocalDateTime.now());
        body.put("message", "Revisa los datos ingresados e intentalo de nuevo.");
        body.put("errorCode", "BAD_REQUEST");
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("field", fieldErrors.isEmpty() ? null : fieldErrors.keySet().iterator().next());
        body.put("fieldLabel", fieldLabels.isEmpty() ? null : fieldLabels.values().iterator().next());
        body.put("fieldMessage", fieldErrors.isEmpty() ? null : fieldErrors.values().iterator().next());
        body.put("errors", fieldErrors);
        body.put("errorLabels", fieldLabels);

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGenericException(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", "Ups, ocurrio un error interno. Intentalo de nuevo en unos minutos.");
        body.put("errorCode", "INTERNAL_SERVER_ERROR");

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private String toFriendlyFieldName(String field) {
        return switch (field) {
            case "username" -> "nombre de usuario";
            case "email" -> "correo electronico";
            case "password" -> "contrasena";
            case "role", "rol" -> "rol";
            default -> field;
        };
    }

    private ResponseEntity<Object> buildErrorResponse(BaseException ex, HttpStatus status) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", ex.getMessage());
        body.put("errorCode", ex.getErrorCode());
        body.put("status", status.value());

        return new ResponseEntity<>(body, status);
    }
}