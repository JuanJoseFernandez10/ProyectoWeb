package com.groovelink.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void enviarCorreo(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    @Async
    public void enviarBienvenida(String to, String username) {
        String subject = "¡Bienvenido a GrooveLink!";
        String body = """
                Hola %s,

                ¡Gracias por registrarte en GrooveLink!

                Ya puedes empezar a descubrir eventos, conectar con otros amantes de la música y mucho más.

                ¡Disfruta de la experiencia!

                — El equipo de GrooveLink
                """.formatted(username);
        enviarCorreo(to, subject, body);
    }
}
