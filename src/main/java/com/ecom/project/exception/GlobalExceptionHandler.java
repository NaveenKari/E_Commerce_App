package com.ecom.project.exception;

import com.ecom.project.payload.ExceptionApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

}
