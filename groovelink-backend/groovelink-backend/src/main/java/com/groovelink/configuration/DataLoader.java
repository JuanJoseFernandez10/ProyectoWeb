package com.groovelink.configuration;

import com.groovelink.entitys.Administrador;
import com.groovelink.enums.Rol;
import com.groovelink.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.seed.default-admin.enabled", havingValue = "true")
public class DataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataLoader.class);

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminUsername;
    private final String adminEmail;
    private final String adminPassword;
    private final String adminCargo;

    public DataLoader(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.seed.default-admin.username}") String adminUsername,
            @Value("${app.seed.default-admin.email}") String adminEmail,
            @Value("${app.seed.default-admin.password}") String adminPassword,
            @Value("${app.seed.default-admin.cargo}") String adminCargo
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminUsername = adminUsername;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
        this.adminCargo = adminCargo;
    }

    @Override
    public void run(String... args) {

        boolean exists = usuarioRepository.existsByUsername(adminUsername);

        if (!exists) {
            Administrador admin = new Administrador();
            admin.setUsername(adminUsername);
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRol(Rol.ROLE_ADMIN);
            admin.setCargo(adminCargo);

            usuarioRepository.save(admin);

            log.info("Default admin user created: {}", adminUsername);
        } else {
            log.info("Default admin user already exists: {}", adminUsername);
        }
    }
}