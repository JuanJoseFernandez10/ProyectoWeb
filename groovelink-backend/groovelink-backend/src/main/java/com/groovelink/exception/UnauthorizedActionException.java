package com.groovelink.exception;

import org.springframework.http.HttpStatus;

public class UnauthorizedActionException extends BaseException {

    public UnauthorizedActionException(String message) {
        super(message, HttpStatus.FORBIDDEN, "UNAUTHORIZED_ACTION");
    }
}