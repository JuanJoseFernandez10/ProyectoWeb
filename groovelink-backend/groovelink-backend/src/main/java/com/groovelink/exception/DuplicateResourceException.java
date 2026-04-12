package com.groovelink.exception;

import org.springframework.http.HttpStatus;

public class DuplicateResourceException extends BaseException {

    public DuplicateResourceException(String resourceName, String field) {
        super(buildMessage(resourceName, field),
                HttpStatus.CONFLICT, "DUPLICATE_RESOURCE");
    }

    private static String buildMessage(String resourceName, String field) {
        if ("username".equalsIgnoreCase(field)) {
            return "Ya existe una cuenta con ese nombre de usuario.";
        }

        if ("email".equalsIgnoreCase(field)) {
            return "Ya existe una cuenta con ese correo electronico.";
        }

        return String.format("Ya existe %s con el campo %s ingresado.",
                resourceName == null ? "un registro" : resourceName.toLowerCase(),
                field == null ? "indicado" : field);
    }
}