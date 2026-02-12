package com.bgv.portfolio.dto;

import com.bgv.portfolio.enums.ApiStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Generic API Response wrapper for consistent response format.
 * All API responses follow this structure.
 *
 * @param <T> the type of data being returned
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private String status;
    private T data;
    private String message;
    private LocalDateTime timestamp;
    private String path;

    /**
     * Creates a success response with data.
     *
     * @param data the data to return
     * @param <T>  the type of data
     * @return ApiResponse with success status
     */
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .status(ApiStatus.SUCCESS.getValue())
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Creates a success response with data and message.
     *
     * @param data    the data to return
     * @param message success message
     * @param <T>     the type of data
     * @return ApiResponse with success status
     */
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .status(ApiStatus.SUCCESS.getValue())
                .data(data)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Creates a success response with only a message (no data).
     *
     * @param message success message
     * @return ApiResponse with success status
     */
    public static ApiResponse<Void> success(String message) {
        return ApiResponse.<Void>builder()
                .status(ApiStatus.SUCCESS.getValue())
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Creates an error response.
     *
     * @param message error message
     * @param path    request path
     * @return ApiResponse with error status
     */
    public static ApiResponse<Void> error(String message, String path) {
        return ApiResponse.<Void>builder()
                .status(ApiStatus.ERROR.getValue())
                .message(message)
                .path(path)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Creates an error response with data (e.g., validation errors).
     *
     * @param message error message
     * @param data    additional error data
     * @param path    request path
     * @param <T>     the type of error data
     * @return ApiResponse with error status
     */
    public static <T> ApiResponse<T> error(String message, T data, String path) {
        return ApiResponse.<T>builder()
                .status(ApiStatus.ERROR.getValue())
                .message(message)
                .data(data)
                .path(path)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
