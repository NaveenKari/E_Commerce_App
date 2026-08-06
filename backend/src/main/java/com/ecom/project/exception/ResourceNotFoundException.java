package com.ecom.project.exception;

public class ResourceNotFoundException extends RuntimeException{
    String resourceName;
    String field;
    String fieldName;
    Long id;

    public ResourceNotFoundException() {
    }

    public ResourceNotFoundException(String resourceName, String field, String fieldName) {
        super(String.format("%s not found with %s and %s",resourceName,field,fieldName));
        this.resourceName = resourceName;
        this.field = field;
        this.fieldName = fieldName;
    }

    public ResourceNotFoundException(String resourceName,  String fieldName,Long id) {
        super(String.format("%s not found with %s: %s",resourceName,fieldName,id));
        this.resourceName = resourceName;
        this.id = id;
        this.fieldName = fieldName;
    }
}
