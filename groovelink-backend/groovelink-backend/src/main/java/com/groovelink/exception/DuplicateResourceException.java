package com.groovelink.exception;

import org.springframework.http.HttpStatus;

public class DuplicateResourceException extends BaseException {

    public DuplicateResourceException(String resourceName, String field) {
        super(String.format("%s con %s ya existe", resourceName, field),
              HttpStatus.CONFLICT, "DUPLICATE_RESOURCE");
    }
}