package com.groovelink.controller;

import com.groovelink.dto.request.LoginRequestDTO;
import com.groovelink.dto.request.RegisterRequestDTO;
import com.groovelink.dto.response.LoginResponseDTO;
import com.groovelink.dto.response.RegisterResponseDTO;
import com.groovelink.entitys.Administrador;
import com.groovelink.entitys.Empresa;
import com.groovelink.entitys.Persona;
import com.groovelink.entitys.Usuario;
import com.groovelink.enums.Rol;
import com.groovelink.exception.DuplicateResourceException;
import com.groovelink.security.JwtProvider;
import com.groovelink.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtProvider jwtProvider,
            UsuarioService usuarioService,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@Valid @RequestBody LoginRequestDTO request) {
        Authentication authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(request.getUsername(), request.getPassword())
        );
        String token = jwtProvider.generateToken(authentication);
        Rol authority = authentication.getAuthorities().stream()
            .findFirst()
            .map(Object::toString)
            .map(Rol::valueOf)
            .orElse(Rol.ROLE_USER);
        return new LoginResponseDTO(
                "Login correcto",
                authentication.getName(),
                authority,
                token
        );
    }

    @PostMapping("/register")
    public RegisterResponseDTO register(@Valid @RequestBody RegisterRequestDTO request) {
        if (usuarioService.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Usuario", "username");
        }
        if (usuarioService.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Usuario", "email");
        }

        Usuario usuario = buildUserByRole(request.getRole());
        usuario.setUsername(request.getUsername());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(request.getRole());

        Usuario saved = usuarioService.save(usuario);

        return new RegisterResponseDTO(
                "Registro correcto",
                saved.getUsername(),
                saved.getRol()
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

    private Usuario buildUserByRole(Rol rol) {
        return switch (rol) {
            case ROLE_USER -> new Persona();
            case ROLE_EMPRESA -> new Empresa();
            case ROLE_ADMIN -> new Administrador();
        };
    }
}

