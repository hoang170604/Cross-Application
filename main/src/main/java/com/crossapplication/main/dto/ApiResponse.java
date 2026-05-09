package com.crossapplication.main.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(
        int status,
        String message,
        T data,
        String errorCode
) {

    public ApiResponse(int status, String message) {
        this(status, message, null, null);
    }

    public ApiResponse(int status, String message, T data) {
        this(status, message, data, null);
    }

    public static <T>ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, "Success", data, null);
    }

    public static <T>ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(200, message, data, null);
    }

    public static <T>ApiResponse<T> error(String message) {
        return new ApiResponse<>(400, message, null, null);
    }

    public static <T>ApiResponse<T> error(String message, String errorCode) {
        return new ApiResponse<>(400, message, null, errorCode);
    }
}

