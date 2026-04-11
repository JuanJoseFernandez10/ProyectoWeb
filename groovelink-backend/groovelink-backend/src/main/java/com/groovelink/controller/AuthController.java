package com.groovelink.controller;

import com.groovelink.dto.request.LoginRequestDTO;
import com.groovelink.dto.response.LoginResponseDTO;
import com.groovelink.security.JwtProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    @Autowired
    private JwtProvider jwtProvider;

    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@Valid @RequestBody LoginRequestDTO request) {
        Authentication authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(request.getUsername(), request.getPassword())
        );
        String token = jwtProvider.generateToken(authentication);
        String authority = authentication.getAuthorities().stream()
                .findFirst()
                .map(Object::toString)
                .orElse("ROLE_USER");

        return new LoginResponseDTO(
                "Login correcto",
                authentication.getName(),
                authority,
                token
        );
    }

    @GetMapping("/login")
    public LoginResponseDTO loginHelp() {
        return new LoginResponseDTO(
                "Usa POST /auth/login con { username, password }",
                null,
                null,
                null
        );
    }
}

