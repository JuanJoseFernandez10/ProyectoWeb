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
import com.groovelink.service.EmailService;
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
    private final EmailService emailService;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtProvider jwtProvider,
            UsuarioService usuarioService,
            PasswordEncoder passwordEncoder,
            EmailService emailService
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
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

        Usuario usuarioLogueado = usuarioService.findByUsername(authentication.getName())
                .orElse(null);
        String email = usuarioLogueado != null ? usuarioLogueado.getEmail() : null;
        boolean premium = usuarioLogueado instanceof Persona persona && persona.isPremium();

        return new LoginResponseDTO(
                "Login correcto",
                authentication.getName(),
                email,
                authority,
                token,
                premium
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

        emailService.enviarBienvenida(saved.getEmail(), saved.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(
                        request.getUsername(), request.getPassword())
        );
        String token = jwtProvider.generateToken(authentication);

        boolean premiumRegistro = saved instanceof Persona personaReg && personaReg.isPremium();

        return new RegisterResponseDTO(
                "Registro correcto",
                saved.getUsername(),
                saved.getRol(),
                token,
                premiumRegistro
        );
    }


    @GetMapping("/login")
    public LoginResponseDTO loginHelp() {
        return new LoginResponseDTO(
                "Usa POST /auth/login con { username, password }",
                null,
                null,
                null,
                null,
                false
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
