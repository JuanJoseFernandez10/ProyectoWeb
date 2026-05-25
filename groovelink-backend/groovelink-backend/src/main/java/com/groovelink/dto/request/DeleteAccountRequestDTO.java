package com.groovelink.dto.request;

import jakarta.validation.constraints.NotBlank;

public class DeleteAccountRequestDTO {
    @NotBlank(message = "Debes ingresar tu contraseña actual para confirmar")
    private String password;

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
