package com.ecom.project.exception;

import com.ecom.project.payload.ExceptionApiResponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,String>> customMethodArgumentNotValidException(MethodArgumentNotValidException e){
        Map<String,String> response = new HashMap<>();

        e.getBindingResult().getAllErrors().forEach((obj) -> {
            String fieldName = ((FieldError)obj).getField();
            String fieldRes = obj.getDefaultMessage();

            response.put(fieldName,fieldRes);
        });

        return new ResponseEntity<Map<String,String>>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ExceptionApiResponse> customResourceNotFoundException(ResourceNotFoundException e){
        ExceptionApiResponse apiResponse = new ExceptionApiResponse(e.getMessage(),false);
        return new ResponseEntity<ExceptionApiResponse>(apiResponse,HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ExceptionApiResponse> ApiException(ApiException e){
        ExceptionApiResponse apiResponse = new ExceptionApiResponse(e.getMessage(),false);
        return new ResponseEntity<ExceptionApiResponse>(apiResponse,HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String,String>> customConstraintViolationException(ConstraintViolationException e){
        Map<String,String> response = new HashMap<>();

        for (ConstraintViolation<?> violation : e.getConstraintViolations()) {
            String fieldName = violation.getPropertyPath().toString();
            response.put(fieldName, violation.getMessage());
        }

        return new ResponseEntity<Map<String,String>>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ExceptionApiResponse> customHttpMessageNotReadableException(HttpMessageNotReadableException e){
        ExceptionApiResponse apiResponse = new ExceptionApiResponse("Malformed request body", false);
        return new ResponseEntity<ExceptionApiResponse>(apiResponse, HttpStatus.BAD_REQUEST);
    }

    // Safety net: without this, any unhandled exception falls through to the container's
    // default /error forward, which re-runs the security filter chain, loses the request's
    // JWT cookie, and surfaces as a misleading 401 instead of the real error.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionApiResponse> customException(Exception e){
        ExceptionApiResponse apiResponse = new ExceptionApiResponse("Something went wrong", false);
        return new ResponseEntity<ExceptionApiResponse>(apiResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
