package com.bgv.portfolio.exception;

import com.bgv.portfolio.constants.AppConstants;
import com.bgv.portfolio.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthorizationDeniedException(
            AuthorizationDeniedException ex, HttpServletRequest request) {
        log.warn("Authorization denied for request: {} - {}", request.getRequestURI(), ex.getMessage());
        
        return new ResponseEntity<>(
                ApiResponse.error(AppConstants.ERR_ACCESS_DENIED, request.getRequestURI()),
                HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(
            AccessDeniedException ex, HttpServletRequest request) {
        log.warn("Access denied for request: {} - {}", request.getRequestURI(), ex.getMessage());
        
        return new ResponseEntity<>(
                ApiResponse.error(AppConstants.ERR_ACCESS_DENIED, request.getRequestURI()),
                HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthenticationException(
            AuthenticationException ex, HttpServletRequest request) {
        log.warn("Authentication failed for request: {} - {}", request.getRequestURI(), ex.getMessage());
        
        return new ResponseEntity<>(
                ApiResponse.error(AppConstants.ERR_AUTHENTICATION_REQUIRED, request.getRequestURI()),
                HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFoundException(
            ResourceNotFoundException ex, HttpServletRequest request) {
        log.error("Resource not found: {}", ex.getMessage());
        
        return new ResponseEntity<>(
                ApiResponse.error(ex.getMessage(), request.getRequestURI()),
                HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationException(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        log.error("Validation error: {}", ex.getMessage());
        
        Map<String, String> validationErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            validationErrors.put(fieldName, errorMessage);
        });

        return new ResponseEntity<>(
                ApiResponse.error(AppConstants.ERR_VALIDATION_FAILED, validationErrors, request.getRequestURI()),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGlobalException(
            Exception ex, HttpServletRequest request) {
        log.error("Unexpected error occurred", ex);
        
        return new ResponseEntity<>(
                ApiResponse.error(AppConstants.ERR_UNEXPECTED, request.getRequestURI()),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

