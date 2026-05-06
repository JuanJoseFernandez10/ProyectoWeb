package com.groovelink.configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.groovelink.entitys.Administrador;
import com.groovelink.entitys.Aptitud;
import com.groovelink.entitys.Evento;
import com.groovelink.entitys.Genero;
import com.groovelink.entitys.Perfil;
import com.groovelink.entitys.Persona;
import com.groovelink.entitys.Usuario;
import com.groovelink.entitys.relations.EventoAptitud;
import com.groovelink.entitys.relations.EventoGenero;
import com.groovelink.entitys.relations.PersonaComentarioEvento;
import com.groovelink.entitys.relations.PersonaGenero;
import com.groovelink.entitys.relations.PersonaMeGustaEvento;
import com.groovelink.entitys.relations.PersonaUneEvento;
import com.groovelink.enums.Rol;
import com.groovelink.repository.AdministradorRepository;
import com.groovelink.repository.AptitudRepository;
import com.groovelink.repository.EventoRepository;
import com.groovelink.repository.GeneroRepository;
import com.groovelink.repository.PerfilRepository;
import com.groovelink.repository.PersonaRepository;
import com.groovelink.repository.UsuarioRepository;
import com.groovelink.repository.relations.EventoAptitudRepository;
import com.groovelink.repository.relations.EventoGeneroRepository;
import com.groovelink.repository.relations.PersonaComentarioEventoRepository;
import com.groovelink.repository.relations.PersonaGeneroRepository;
import com.groovelink.repository.relations.PersonaMeGustaEventoRepository;
import com.groovelink.repository.relations.PersonaUneEventoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@ConditionalOnProperty(name = "app.seed.demo.enabled", havingValue = "true", matchIfMissing = true)
public class DemoDataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataLoader.class);

    private final UsuarioRepository usuarioRepository;
    private final AdministradorRepository administradorRepository;
    private final PersonaRepository personaRepository;
    private final PerfilRepository perfilRepository;
    private final AptitudRepository aptitudRepository;
    private final GeneroRepository generoRepository;
    private final EventoRepository eventoRepository;
    private final EventoAptitudRepository eventoAptitudRepository;
    private final EventoGeneroRepository eventoGeneroRepository;
    private final PersonaGeneroRepository personaGeneroRepository;
    private final PersonaComentarioEventoRepository personaComentarioEventoRepository;
    private final PersonaMeGustaEventoRepository personaMeGustaEventoRepository;
    private final PersonaUneEventoRepository personaUneEventoRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataLoader(
            UsuarioRepository usuarioRepository,
            AdministradorRepository administradorRepository,
            PersonaRepository personaRepository,
            PerfilRepository perfilRepository,
            AptitudRepository aptitudRepository,
            GeneroRepository generoRepository,
            EventoRepository eventoRepository,
            EventoAptitudRepository eventoAptitudRepository,
            EventoGeneroRepository eventoGeneroRepository,
            PersonaGeneroRepository personaGeneroRepository,
            PersonaComentarioEventoRepository personaComentarioEventoRepository,
            PersonaMeGustaEventoRepository personaMeGustaEventoRepository,
            PersonaUneEventoRepository personaUneEventoRepository,
            PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.administradorRepository = administradorRepository;
        this.personaRepository = personaRepository;
        this.perfilRepository = perfilRepository;
        this.aptitudRepository = aptitudRepository;
        this.generoRepository = generoRepository;
        this.eventoRepository = eventoRepository;
        this.eventoAptitudRepository = eventoAptitudRepository;
        this.eventoGeneroRepository = eventoGeneroRepository;
        this.personaGeneroRepository = personaGeneroRepository;
        this.personaComentarioEventoRepository = personaComentarioEventoRepository;
        this.personaMeGustaEventoRepository = personaMeGustaEventoRepository;
        this.personaUneEventoRepository = personaUneEventoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        Administrador admin = ensureAdministrador("admin", "admin@local.dev", "admin123", "SUPERADMIN");

        Persona juan = ensurePersona("juan", "juan@local.dev", "juan123", true);
        Persona maria = ensurePersona("maria", "maria@local.dev", "maria123", false);
        Persona carlos = ensurePersona("carlos", "carlos@local.dev", "carlos123", true);

        savePerfil(juan, "Amante de la música indie");
        savePerfil(maria, "Exploradora de música electrónica");
        savePerfil(carlos, "Rockero de corazón");

        Aptitud conciertos = saveAptitud("Conciertos");
        Aptitud fiesta = saveAptitud("Fiesta");
        Aptitud networking = saveAptitud("Networking");
        Aptitud afterwork = saveAptitud("Afterwork");

        Genero indie = saveGenero("Indie");
        Genero electronica = saveGenero("Electrónica");
        Genero rock = saveGenero("Rock");
        Genero urbana = saveGenero("Urbana");

        Evento indieSunset = ensureEvento("Indie Sunset Session", "Madrid", "Tarde de bandas emergentes y plan chill para arrancar el finde.", LocalDate.of(2026, 6, 14), admin);
        Evento electroRooftop = ensureEvento("Electro Rooftop Night", "Valencia", "Sesión electrónica en azotea con DJs invitados y buen ambiente.", LocalDate.of(2026, 6, 21), admin);
        Evento rockFriends = ensureEvento("Rock & Friends Live", "Sevilla", "Concierto íntimo con zona para grupos y after para conocerse.", LocalDate.of(2026, 7, 5), admin);
        Evento urbanBeats = ensureEvento("Urban Beats Meetup", "Barcelona", "Encuentro urbano con música, conversación y gente nueva.", LocalDate.of(2026, 6, 29), admin);
        Evento afterworkPop = ensureEvento("Afterwork Pop Session", "Bilbao", "Plan tranquilo para salir del trabajo y terminar con música.", LocalDate.of(2026, 7, 11), admin);
        Evento nightGroove = ensureEvento("Night Groove Club", "Málaga", "Sesión nocturna para cerrar la semana con pista y amigos.", LocalDate.of(2026, 7, 18), admin);

        ensureEventoAptitud(indieSunset, conciertos);
        ensureEventoAptitud(electroRooftop, fiesta);
        ensureEventoAptitud(rockFriends, conciertos);
        ensureEventoAptitud(urbanBeats, networking);
        ensureEventoAptitud(afterworkPop, afterwork);
        ensureEventoAptitud(nightGroove, fiesta);

        ensureEventoGenero(indieSunset, indie);
        ensureEventoGenero(electroRooftop, electronica);
        ensureEventoGenero(rockFriends, rock);
        ensureEventoGenero(urbanBeats, urbana);
        ensureEventoGenero(afterworkPop, indie);
        ensureEventoGenero(nightGroove, electronica);

        ensurePersonaGenero(juan, indie);
        ensurePersonaGenero(juan, rock);
        ensurePersonaGenero(maria, electronica);
        ensurePersonaGenero(maria, urbana);
        ensurePersonaGenero(carlos, rock);
        ensurePersonaGenero(carlos, indie);

        ensureMeGusta(juan, indieSunset);
        ensureMeGusta(maria, indieSunset);
        ensureMeGusta(carlos, indieSunset);
        ensureMeGusta(juan, electroRooftop);
        ensureMeGusta(maria, electroRooftop);
        ensureMeGusta(carlos, electroRooftop);
        ensureMeGusta(juan, rockFriends);
        ensureMeGusta(maria, rockFriends);
        ensureMeGusta(carlos, rockFriends);
        ensureMeGusta(juan, urbanBeats);

        ensureAsistencia(juan, indieSunset);
        ensureAsistencia(maria, indieSunset);
        ensureAsistencia(juan, electroRooftop);
        ensureAsistencia(carlos, electroRooftop);
        ensureAsistencia(maria, rockFriends);
        ensureAsistencia(juan, urbanBeats);
        ensureAsistencia(carlos, afterworkPop);

        ensureComentario(juan, indieSunset, "Muy buen ambiente, la mejor sesión del mes", 3);
        ensureComentario(maria, indieSunset, "Excelente propuesta, volvería sin dudarlo", 2);
        ensureComentario(carlos, electroRooftop, "La mejor fiesta electrónica del año", 5);
        ensureComentario(juan, rockFriends, "Rock en vivo como debe ser", 4);

        long usuarios = usuarioRepository.count();
        long eventos = eventoRepository.count();
        long asistencias = personaUneEventoRepository.count();
        long megustas = personaMeGustaEventoRepository.count();
        long aptitudesCount = aptitudRepository.count();
        long generosCount = generoRepository.count();
        long perfilesCount = perfilRepository.count();

        log.info("Demo seed summary: usuarios={}, eventos={}, asistencias={}, megustas={}, aptitudes={}, generos={}, perfiles={}",
            usuarios, eventos, asistencias, megustas, aptitudesCount, generosCount, perfilesCount);
    }

    private Administrador ensureAdministrador(String username, String email, String rawPassword, String cargo) {
        Optional<Usuario> existing = usuarioRepository.findByUsername(username);
        if (existing.isPresent() && existing.get() instanceof Administrador administrador) {
            return administrador;
        }

        Administrador administrador = new Administrador();
        existing.ifPresent(usuario -> administrador.setId(usuario.getId()));
        administrador.setUsername(username);
        administrador.setEmail(email);
        administrador.setPassword(existing.map(Usuario::getPassword).orElseGet(() -> passwordEncoder.encode(rawPassword)));
        administrador.setRol(Rol.ROLE_ADMIN);
        administrador.setCargo(cargo);
        return administradorRepository.save(administrador);
    }

    private Persona ensurePersona(String username, String email, String rawPassword, boolean premium) {
        Optional<Usuario> existing = usuarioRepository.findByUsername(username);
        if (existing.isPresent() && existing.get() instanceof Persona persona) {
            return persona;
        }

        Persona persona = new Persona();
        existing.ifPresent(usuario -> persona.setId(usuario.getId()));
        persona.setUsername(username);
        persona.setEmail(email);
        persona.setPassword(existing.map(Usuario::getPassword).orElseGet(() -> passwordEncoder.encode(rawPassword)));
        persona.setRol(Rol.ROLE_USER);
        persona.setPremium(premium);
        return personaRepository.save(persona);
    }

    private void savePerfil(Persona persona, String descripcion) {
        if (perfilRepository.existsById(persona.getId())) {
            return;
        }

        Perfil perfil = new Perfil();
        perfil.setUsuario(persona);
        perfil.setDescripcion(descripcion);
        perfilRepository.save(perfil);
    }

    private Aptitud saveAptitud(String nombre) {
        return aptitudRepository.findByNombre(nombre).orElseGet(() -> {
            Aptitud aptitud = new Aptitud();
            aptitud.setNombre(nombre);
            return aptitudRepository.save(aptitud);
        });
    }

    private Genero saveGenero(String nombre) {
        return generoRepository.findByNombre(nombre).orElseGet(() -> {
            Genero genero = new Genero();
            genero.setNombre(nombre);
            return generoRepository.save(genero);
        });
    }

    private Evento ensureEvento(String nombre, String ubicacion, String descripcion, LocalDate fecha, Usuario publicado) {
        return eventoRepository.findByNombre(nombre).orElseGet(() -> {
            Evento evento = new Evento();
            evento.setNombre(nombre);
            evento.setUbicacion(ubicacion);
            evento.setDescripcion(descripcion);
            evento.setFechaInicio(fecha);
            evento.setFechaFinal(fecha);
            evento.setPublicado(publicado);
            return eventoRepository.save(evento);
        });
    }

    private void ensureEventoAptitud(Evento evento, Aptitud aptitud) {
        boolean exists = eventoAptitudRepository.findByEvento_Id(evento.getId()).stream()
                .anyMatch(relation -> relation.getAptitud() != null && relation.getAptitud().getId().equals(aptitud.getId()));
        if (!exists) {
            EventoAptitud relation = new EventoAptitud();
            relation.setEvento(evento);
            relation.setAptitud(aptitud);
            eventoAptitudRepository.save(relation);
        }
    }

    private void ensureEventoGenero(Evento evento, Genero genero) {
        if (!eventoGeneroRepository.existsByEvento_IdAndGenero_Id(evento.getId(), genero.getId())) {
            EventoGenero relation = new EventoGenero();
            relation.setEvento(evento);
            relation.setGenero(genero);
            eventoGeneroRepository.save(relation);
        }
    }

    private void ensurePersonaGenero(Persona persona, Genero genero) {
        if (!personaGeneroRepository.existsByUsuario_IdAndGenero_Id(persona.getId(), genero.getId())) {
            PersonaGenero relation = new PersonaGenero();
            relation.setUsuario(persona);
            relation.setGenero(genero);
            personaGeneroRepository.save(relation);
        }
    }

    private void ensureMeGusta(Persona persona, Evento evento) {
        if (!personaMeGustaEventoRepository.existsByUsuario_IdAndEvento_Id(persona.getId(), evento.getId())) {
            PersonaMeGustaEvento relation = new PersonaMeGustaEvento();
            relation.setUsuario(persona);
            relation.setEvento(evento);
            personaMeGustaEventoRepository.save(relation);
        }
    }

    private void ensureAsistencia(Persona persona, Evento evento) {
        if (!personaUneEventoRepository.existsByUsuario_IdAndEvento_Id(persona.getId(), evento.getId())) {
            PersonaUneEvento relation = new PersonaUneEvento();
            relation.setUsuario(persona);
            relation.setEvento(evento);
            personaUneEventoRepository.save(relation);
        }
    }

    private void ensureComentario(Persona persona, Evento evento, String texto, Integer likes) {
        boolean exists = personaComentarioEventoRepository.findByUsuario_Id(persona.getId()).stream()
                .anyMatch(relation -> relation.getEvento() != null
                        && relation.getEvento().getId().equals(evento.getId())
                        && texto.equals(relation.getTexto()));
        if (!exists) {
            PersonaComentarioEvento relation = new PersonaComentarioEvento();
            relation.setUsuario(persona);
            relation.setEvento(evento);
            relation.setTexto(texto);
            relation.setMegustas(likes);
            relation.setFecha(LocalDateTime.now());
            personaComentarioEventoRepository.save(relation);
        }
    }
}