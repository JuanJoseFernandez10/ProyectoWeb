package com.groovelink.dto.response;

import com.groovelink.enums.Rol;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private String message;
    private String username;
    private Rol role;
    private String token;  // token JWT para cada request
}
