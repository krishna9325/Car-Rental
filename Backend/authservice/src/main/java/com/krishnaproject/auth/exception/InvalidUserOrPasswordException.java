package com.krishnaproject.auth.exception;

public class InvalidUserOrPasswordException extends RuntimeException {
    public InvalidUserOrPasswordException(String msg)
    {
        super(msg);
    }
}
