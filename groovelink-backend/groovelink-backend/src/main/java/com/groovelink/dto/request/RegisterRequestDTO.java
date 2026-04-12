package com.groovelink.dto.request;

import com.groovelink.enums.Rol;
import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
public class RegisterRequestDTO {

    @NotBlank(message = "El username es obligatorio")
    private String username;

    @NotBlank(message = "El email es obligatorio")
    private String email;

    @NotBlank(message = "La password es obligatoria")
    private String password;

    @NotNull(message = "Elegir un rol es obligatorio")
    private Rol role;


    public RegisterRequestDTO() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Rol getRole() {
        return role;
    }

    @JsonAlias("rol")
    public void setRole(Rol role) {
        this.role = role;
    }

    public Rol getRol() {
        return getRole();
    }

    public void setRol(Rol role) {
        setRole(role);
    }
}
