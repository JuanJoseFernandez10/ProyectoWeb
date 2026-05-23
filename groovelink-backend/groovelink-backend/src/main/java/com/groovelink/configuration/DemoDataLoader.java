package com.groovelink.configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.groovelink.entitys.Administrador;
import com.groovelink.entitys.Aptitud;
import com.groovelink.entitys.Chat;
import com.groovelink.entitys.Evento;
import com.groovelink.entitys.Genero;
import com.groovelink.entitys.Mensaje;
import com.groovelink.entitys.Perfil;
import com.groovelink.entitys.Persona;
import com.groovelink.entitys.Usuario;
import com.groovelink.entitys.relations.EventoAptitud;
import com.groovelink.entitys.relations.EventoGenero;
import com.groovelink.entitys.relations.PersonaComentarioEvento;
import com.groovelink.entitys.relations.PersonaGenero;
import com.groovelink.entitys.relations.PersonaMeGustaEvento;
import com.groovelink.entitys.relations.PersonaUneEvento;
import com.groovelink.entitys.Reporte;
import com.groovelink.enums.Rol;
import com.groovelink.repository.AdministradorRepository;
import com.groovelink.repository.AptitudRepository;
import com.groovelink.repository.ChatRepository;
import com.groovelink.repository.EventoRepository;
import com.groovelink.repository.GeneroRepository;
import com.groovelink.repository.MensajeRepository;
import com.groovelink.repository.PerfilRepository;
import com.groovelink.repository.PersonaRepository;
import com.groovelink.repository.ReporteRepository;
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
    private final ChatRepository chatRepository;
    private final MensajeRepository mensajeRepository;
    private final ReporteRepository reporteRepository;
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
            ChatRepository chatRepository,
            MensajeRepository mensajeRepository,
            ReporteRepository reporteRepository,
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
        this.chatRepository = chatRepository;
        this.mensajeRepository = mensajeRepository;
        this.reporteRepository = reporteRepository;
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

        ensureChats();
        ensureMensajes();

        ensureReportes();

        long usuarios = usuarioRepository.count();
        long eventos = eventoRepository.count();
        long asistencias = personaUneEventoRepository.count();
        long megustas = personaMeGustaEventoRepository.count();
        long aptitudesCount = aptitudRepository.count();
        long generosCount = generoRepository.count();
        long perfilesCount = perfilRepository.count();
        long chats = chatRepository.count();
        long mensajes = mensajeRepository.count();
        long reportes = reporteRepository.count();

        log.info("Demo seed summary: usuarios={}, eventos={}, asistencias={}, megustas={}, aptitudes={}, generos={}, perfiles={}, chats={}, mensajes={}, reportes={}",
            usuarios, eventos, asistencias, megustas, aptitudesCount, generosCount, perfilesCount, chats, mensajes, reportes);
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

    private void ensureChats() {
        if (chatRepository.count() > 0) return;

        Persona juan = findPersona("juan");
        Persona maria = findPersona("maria");
        Persona carlos = findPersona("carlos");
        if (juan == null || maria == null || carlos == null) return;

        Chat grupoMusica = new Chat();
        grupoMusica.setNombre("Grupo Música");
        grupoMusica.setEsGrupal(true);
        grupoMusica.setParticipantes(List.of(juan, maria, carlos));
        chatRepository.save(grupoMusica);

        Chat chatJuanMaria = new Chat();
        chatJuanMaria.setNombre("Juan y María");
        chatJuanMaria.setEsGrupal(false);
        chatJuanMaria.setParticipantes(List.of(juan, maria));
        chatRepository.save(chatJuanMaria);

        Chat chatJuanCarlos = new Chat();
        chatJuanCarlos.setNombre("Juan y Carlos");
        chatJuanCarlos.setEsGrupal(false);
        chatJuanCarlos.setParticipantes(List.of(juan, carlos));
        chatRepository.save(chatJuanCarlos);
    }

    private void ensureMensajes() {
        if (mensajeRepository.count() > 0) return;

        Persona juan = findPersona("juan");
        Persona maria = findPersona("maria");
        Persona carlos = findPersona("carlos");
        if (juan == null || maria == null || carlos == null) return;

        List<Chat> chats = chatRepository.findAll();
        for (Chat chat : chats) {
            if ("Grupo Música".equals(chat.getNombre())) {
                saveMensaje(chat, juan, "¡Bienvenidos al grupo! 🎵");
                saveMensaje(chat, maria, "Hola a todos!");
                saveMensaje(chat, carlos, "Qué buena idea crear este grupo");
                chat.setUltimoMensaje(LocalDateTime.now());
                chatRepository.save(chat);
            } else if ("Juan y María".equals(chat.getNombre())) {
                saveMensaje(chat, juan, "Hola María! ¿Vas al concierto del sábado?");
                saveMensaje(chat, maria, "Sí! Tengo muchas ganas");
                chat.setUltimoMensaje(LocalDateTime.now());
                chatRepository.save(chat);
            } else if ("Juan y Carlos".equals(chat.getNombre())) {
                saveMensaje(chat, juan, "Carlos! ¿Te apuntas al evento del finde?");
                saveMensaje(chat, carlos, "Claro! Cuenta conmigo");
                chat.setUltimoMensaje(LocalDateTime.now());
                chatRepository.save(chat);
            }
        }
    }

    private void saveMensaje(Chat chat, Persona usuario, String contenido) {
        Mensaje mensaje = new Mensaje();
        mensaje.setChat(chat);
        mensaje.setUsuario(usuario);
        mensaje.setContenido(contenido);
        mensaje.setFechaEnvio(LocalDateTime.now());
        mensajeRepository.save(mensaje);
    }

    private Persona findPersona(String username) {
        return usuarioRepository.findByUsername(username)
                .filter(u -> u instanceof Persona)
                .map(u -> (Persona) u)
                .orElse(null);
    }

    private void ensureReportes() {
        if (reporteRepository.count() > 0) return;

        Persona juan = findPersona("juan");
        Persona maria = findPersona("maria");
        Persona carlos = findPersona("carlos");
        if (juan == null || maria == null || carlos == null) return;

        List<Evento> eventos = eventoRepository.findAll();

        Reporte r1 = new Reporte();
        r1.setReportero(juan);
        r1.setTipoContenido("EVENTO");
        r1.setIdContenido(eventos.get(0).getId());
        r1.setMotivo("Contenido inapropiado");
        r1.setDetalleAdicional("El evento contiene descripciones que pueden resultar ofensivas");
        r1.setEstado("PENDIENTE");
        r1.setFechaReporte(LocalDateTime.now());
        reporteRepository.save(r1);

        Reporte r2 = new Reporte();
        r2.setReportero(maria);
        r2.setTipoContenido("EVENTO");
        r2.setIdContenido(eventos.get(1).getId());
        r2.setMotivo("Información engañosa");
        r2.setDetalleAdicional("La fecha del evento no coincide con la realidad");
        r2.setEstado("PENDIENTE");
        r2.setFechaReporte(LocalDateTime.now().minusDays(1));
        reporteRepository.save(r2);

        Reporte r3 = new Reporte();
        r3.setReportero(carlos);
        r3.setTipoContenido("EVENTO");
        r3.setIdContenido(eventos.get(2).getId());
        r3.setMotivo("Spam");
        r3.setDetalleAdicional("Este evento se ha promocionado de forma repetitiva en múltiples ocasiones");
        r3.setEstado("RESUELTO");
        r3.setFechaReporte(LocalDateTime.now().minusDays(3));
        reporteRepository.save(r3);

        Reporte r4 = new Reporte();
        r4.setReportero(juan);
        r4.setTipoContenido("EVENTO");
        r4.setIdContenido(eventos.get(3).getId());
        r4.setMotivo("Otro");
        r4.setDetalleAdicional("El evento no cumple con las normas de la comunidad");
        r4.setEstado("PENDIENTE");
        r4.setFechaReporte(LocalDateTime.now().minusHours(5));
        reporteRepository.save(r4);
    }
}