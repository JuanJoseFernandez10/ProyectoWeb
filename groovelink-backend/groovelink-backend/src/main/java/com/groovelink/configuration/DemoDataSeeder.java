package com.groovelink.configuration;

import com.groovelink.entitys.*;
import com.groovelink.entitys.relations.*;
import com.groovelink.enums.Rol;
import com.groovelink.repository.AdministradorRepository;
import com.groovelink.repository.AptitudRepository;
import com.groovelink.repository.GeneroRepository;
import com.groovelink.repository.PersonaRepository;
import com.groovelink.repository.PerfilRepository;
import com.groovelink.repository.EventoRepository;
import com.groovelink.repository.SolicitudAmistadRepository;
import com.groovelink.repository.ChatRepository;
import com.groovelink.repository.MensajeRepository;
import com.groovelink.repository.relations.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.core.annotation.Order;

@Component
@Order(1)
@ConditionalOnProperty(name = "app.seed.demo.enabled", havingValue = "true")
public class DemoDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);

    @PersistenceContext
    private EntityManager em;

    private final PasswordEncoder passwordEncoder;
    private final AptitudRepository aptitudRepository;
    private final GeneroRepository generoRepository;
    private final PersonaRepository personaRepository;
    private final PerfilRepository perfilRepository;
    private final EventoRepository eventoRepository;
    private final SolicitudAmistadRepository solicitudAmistadRepository;
    private final PersonaAptitudRepository personaAptitudRepository;
    private final PersonaGeneroRepository personaGeneroRepository;
    private final PersonaUneEventoRepository personaUneEventoRepository;
    private final PersonaMeGustaEventoRepository personaMeGustaEventoRepository;
    private final PersonaComentarioEventoRepository personaComentarioEventoRepository;
    private final ChatRepository chatRepository;
    private final MensajeRepository mensajeRepository;
    private final EventoAptitudRepository eventoAptitudRepository;
    private final EventoGeneroRepository eventoGeneroRepository;
    private final AdministradorRepository administradorRepository;

    public DemoDataSeeder(PasswordEncoder passwordEncoder,
                          AptitudRepository aptitudRepository,
                          GeneroRepository generoRepository,
                          PersonaRepository personaRepository,
                          PerfilRepository perfilRepository,
                          EventoRepository eventoRepository,
                          SolicitudAmistadRepository solicitudAmistadRepository,
                          PersonaAptitudRepository personaAptitudRepository,
                          PersonaGeneroRepository personaGeneroRepository,
                          PersonaUneEventoRepository personaUneEventoRepository,
                          PersonaMeGustaEventoRepository personaMeGustaEventoRepository,
                          PersonaComentarioEventoRepository personaComentarioEventoRepository,
                          ChatRepository chatRepository,
                          MensajeRepository mensajeRepository,
                          EventoAptitudRepository eventoAptitudRepository,
                          EventoGeneroRepository eventoGeneroRepository,
                          AdministradorRepository administradorRepository) {
        this.passwordEncoder = passwordEncoder;
        this.aptitudRepository = aptitudRepository;
        this.generoRepository = generoRepository;
        this.personaRepository = personaRepository;
        this.perfilRepository = perfilRepository;
        this.eventoRepository = eventoRepository;
        this.solicitudAmistadRepository = solicitudAmistadRepository;
        this.personaAptitudRepository = personaAptitudRepository;
        this.personaGeneroRepository = personaGeneroRepository;
        this.personaUneEventoRepository = personaUneEventoRepository;
        this.personaMeGustaEventoRepository = personaMeGustaEventoRepository;
        this.personaComentarioEventoRepository = personaComentarioEventoRepository;
        this.chatRepository = chatRepository;
        this.mensajeRepository = mensajeRepository;
        this.eventoAptitudRepository = eventoAptitudRepository;
        this.eventoGeneroRepository = eventoGeneroRepository;
        this.administradorRepository = administradorRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        log.info("=== INICIANDO CARGA DE DATOS DEMO ===");

        limpiarBaseDeDatos();

        List<Aptitud> aptitudes = crearAptitudes();
        List<Genero> generos = crearGeneros();
        List<Persona> personas = crearPersonas(aptitudes, generos);
        crearAdmin();
        List<Evento> eventos = crearEventos(personas, aptitudes, generos);
        crearAmistades(personas);
        crearParticipaciones(personas, eventos);
        crearComentarios(personas, eventos);
        crearChatsGrupo(eventos, personas);
        crearMensajes(personas);

        log.info("=== CARGA DE DATOS DEMO COMPLETADA ===");
        log.info("Usuarios creados: {}", personas.size());
        log.info("Eventos creados: {}", eventos.size());
        log.info("Password para todos los usuarios de prueba: 123456");
    }

    private void limpiarBaseDeDatos() {
        log.info("Limpiando base de datos...");
        em.createNativeQuery("""
            TRUNCATE TABLE
                mensaje,
                usuario_participa_chat,
                persona_comentario_evento,
                persona_megusta_evento,
                persona_une_evento,
                foto_evento,
                evento_aptitudes,
                evento_generos,
                persona_aptitudes,
                persona_generos,
                solicitud_amistad,
                notificacion,
                reporte,
                chat,
                empresa,
                administrador,
                persona,
                evento,
                perfil,
                usuario,
                aptitud,
                genero
            CASCADE
        """).executeUpdate();
        em.clear();
        log.info("Base de datos limpiada.");
    }

    private void crearAdmin() {
        Administrador admin = new Administrador();
        admin.setUsername("admin");
        admin.setEmail("admin@example.com");
        admin.setPassword(passwordEncoder.encode("123456"));
        admin.setRol(Rol.ROLE_ADMIN);
        admin.setCargo("SUPERADMIN");
        admin.setFechaCreacion(LocalDateTime.now());
        administradorRepository.save(admin);
        log.info("Admin creado: admin / 123456");
    }

    private List<Aptitud> crearAptitudes() {
        log.info("Creando aptitudes...");
        List<String> nombres = List.of(
            "Cocina", "Baile", "Fotografía", "Pintura", "Lectura",
            "Deportes", "Música", "Viajes", "Yoga", "Gaming",
            "Escritura", "Cine", "Running", "Idiomas", "Voluntariado"
        );
        List<Aptitud> aptitudes = new ArrayList<>();
        for (String nombre : nombres) {
            Aptitud a = new Aptitud();
            a.setNombre(nombre);
            aptitudes.add(aptitudRepository.save(a));
        }
        return aptitudes;
    }

    private List<Genero> crearGeneros() {
        log.info("Creando generos musicales...");
        List<String> nombres = List.of(
            "Rock", "Pop", "Electrónica", "Jazz", "Reggaeton",
            "Clásica", "Hip-Hop", "Indie", "Flamenco", "R&B",
            "Soul", "Metal", "Blues", "Funk", "Alternativo"
        );
        List<Genero> generos = new ArrayList<>();
        for (String nombre : nombres) {
            Genero g = new Genero();
            g.setNombre(nombre);
            generos.add(generoRepository.save(g));
        }
        return generos;
    }

    private List<Persona> crearPersonas(List<Aptitud> aptitudes, List<Genero> generos) {
        log.info("Creando usuarios de prueba...");
        String password = passwordEncoder.encode("123456");

        record DatosPersona(String username, String email, String descripcion, String ubicacion, boolean premium,
                            List<Integer> aptitudIndices, List<Integer> generoIndices) {}

        List<DatosPersona> datos = List.of(
            new DatosPersona("carlos_garcia", "carlos@email.com",
                "Me gusta salir de fiesta y concer gente nueva. Ultimamente estoy aprendiendo a tocar la guitarra.",
                "Madrid", false, List.of(1, 6, 11), List.of(0, 1, 7)),
            new DatosPersona("maria_lopez", "maria@email.com",
                "Soy de Barcelona pero vivo en Madrid por estudios. Busco gente para hacer planes!",
                "Madrid", false, List.of(0, 2, 4), List.of(1, 3, 8)),
            new DatosPersona("alejandro_m", "alejandro@email.com",
                "Apasionado del deporte y la naturaleza. Escapo a la montaña siempre que puedo. Tambien me gusta la fotografia.",
                "Valencia", true, List.of(5, 2, 7), List.of(6, 13, 14)),
            new DatosPersona("laura_sevilla", "laura@email.com",
                "Fotógrafa aficionada, me encanta capturar momentos. Tambien me gusta cocinar y viajar!",
                "Sevilla", false, List.of(0, 2, 7), List.of(3, 8, 11)),
            new DatosPersona("david_ruiz", "david@email.com",
                "Ingeniero de dia, musico de noche. Toco la bateria en una banda de rock local.",
                "Bilbao", false, List.of(6, 11, 12), List.of(0, 11, 12)),
            new DatosPersona("ana_perez", "ana@email.com",
                "Estudiante de bellas artes. Me encanta pintar y ir a exposiciones. También hago yoga.",
                "Granada", false, List.of(3, 8, 14), List.of(7, 14, 8)),
            new DatosPersona("javi_rodri", "javi@email.com",
                "Gamer y amante de la tecnologia. Me gusta el cine y los planes tranquilos.",
                "Zaragoza", true, List.of(9, 11, 13), List.of(6, 2, 14)),
            new DatosPersona("sara_mm", "sara@email.com",
                "Viajera empedernida, he visitado 15 paises. Ahora busco gente para planes por Malaga!",
                "Málaga", false, List.of(7, 12, 14), List.of(1, 2, 5))
        );

        List<Persona> personas = new ArrayList<>();

        for (DatosPersona d : datos) {
            Persona p = new Persona();
            p.setUsername(d.username());
            p.setEmail(d.email());
            p.setPassword(password);
            p.setRol(Rol.ROLE_USER);
            p.setPremium(d.premium());
            p.setFechaCreacion(LocalDateTime.now().minusDays((long) (Math.random() * 60)));
            p = personaRepository.save(p);

            Perfil perfil = new Perfil();
            perfil.setUsuario(p);
            perfil.setDescripcion(d.descripcion());
            perfil.setUbicacion(d.ubicacion());
            perfil.setFechaActualizacion(LocalDateTime.now());
            perfilRepository.save(perfil);

            for (Integer i : d.aptitudIndices()) {
                PersonaAptitud pa = new PersonaAptitud();
                pa.setUsuario(p);
                pa.setAptitud(aptitudes.get(i));
                personaAptitudRepository.save(pa);
            }

            for (Integer i : d.generoIndices()) {
                PersonaGenero pg = new PersonaGenero();
                pg.setUsuario(p);
                pg.setGenero(generos.get(i));
                personaGeneroRepository.save(pg);
            }

            personas.add(p);
        }

        return personas;
    }

    private List<Evento> crearEventos(List<Persona> personas, List<Aptitud> aptitudes, List<Genero> generos) {
        log.info("Creando eventos de prueba...");

        record DatosEvento(String nombre, String ubicacion, String descripcion, LocalDate fechaInicio, LocalDate fechaFinal,
                           int publicadoIndex, List<Integer> aptitudIndices, List<Integer> generoIndices) {}

        List<DatosEvento> datos = List.of(
            new DatosEvento("Noche de Jazz en el Casco Antiguo",
                "Barrio de las Letras, Madrid",
                "Ven a disfrutar de una noche de jazz en el barrio antiguo. Habra musica en directo y cocteles. Entrada gratuita hasta completar aforo! Tambien tendremos jam session abierta para quien quiera unirse al final.",
                LocalDate.now().plusDays(5), LocalDate.now().plusDays(5), 0,
                List.of(6), List.of(3)),
            new DatosEvento("Taller de Cocina Italiana",
                "Calle Mayor 23, Madrid",
                "Aprende a hacer pasta desde cero con ingredientes frescos. Vamos a cocinar raviolis y tiramisú. Despues nos lo comemos todo juntos. Plazas limitadas!",
                LocalDate.now().plusDays(12), LocalDate.now().plusDays(12), 1,
                List.of(0), List.of(1)),
            new DatosEvento("Ruta de Senderismo por la Sierra",
                "Puerto de Navacerrada, Madrid",
                "Ruta guiada por la sierra con vistas espectaculares. Dificultad baja-media, apto para principiantes. Llevar agua y calzado comodo. Comemos alli, cada uno lleva su tupper!",
                LocalDate.now().plusDays(8), LocalDate.now().plusDays(8), 2,
                List.of(5, 7), List.of(7)),
            new DatosEvento("Torneo de Videojuegos Retro",
                "Game Over Bar, Calle Fuencarral 45, Madrid",
                "Torneo de juegos retro con premios! Tendremos Street Fighter, Mario Kart y Guitar Hero. Inscripcion 5€ incluye una consumicion. Os esperamos!",
                LocalDate.now().plusDays(3), LocalDate.now().plusDays(3), 6,
                List.of(9), List.of(6)),
            new DatosEvento("Exposición de Fotografía Urbana",
                "Galería La Fábrica, C/Alameda 12, Sevilla",
                "Exposición colectiva de fotografia urbana con artistas locales. Despues de la expo haremos un recorrido fotografico por el barrio de Triana.",
                LocalDate.now().plusDays(15), LocalDate.now().plusDays(17), 3,
                List.of(2), List.of(8)),
            new DatosEvento("Jam Session de Rock",
                "La Rock House, Bilbao",
                "Jam session abierta para musicos de todos los niveles. Trae tu instrumento y unete! Hay amplis y bateria. Desde las 20:00 hasta que el cuerpo aguante.",
                LocalDate.now().plusDays(10), LocalDate.now().plusDays(10), 4,
                List.of(6), List.of(0, 11, 12))
        );

        List<Evento> eventos = new ArrayList<>();

        for (DatosEvento d : datos) {
            Evento e = new Evento();
            e.setNombre(d.nombre());
            e.setUbicacion(d.ubicacion());
            e.setDescripcion(d.descripcion());
            e.setFechaInicio(d.fechaInicio());
            e.setFechaFinal(d.fechaFinal());
            e.setPublicado(personas.get(d.publicadoIndex()));
            e.setFechaCreacion(LocalDateTime.now().minusDays((long) (1 + Math.random() * 14)));
            e = eventoRepository.save(e);

            for (Integer i : d.aptitudIndices()) {
                EventoAptitud ea = new EventoAptitud();
                ea.setEvento(e);
                ea.setAptitud(aptitudes.get(i));
                eventoAptitudRepository.save(ea);
            }

            for (Integer i : d.generoIndices()) {
                EventoGenero eg = new EventoGenero();
                eg.setEvento(e);
                eg.setGenero(generos.get(i));
                eventoGeneroRepository.save(eg);
            }

            eventos.add(e);
        }

        return eventos;
    }

    private void crearAmistades(List<Persona> personas) {
        log.info("Creando relaciones de amistad...");

        record Amistad(int a, int b) {}
        List<Amistad> amistades = List.of(
            new Amistad(0, 1), new Amistad(0, 2),
            new Amistad(1, 0), new Amistad(1, 3), new Amistad(1, 5),
            new Amistad(2, 0), new Amistad(2, 4), new Amistad(2, 6),
            new Amistad(3, 1), new Amistad(3, 7),
            new Amistad(4, 2), new Amistad(4, 5),
            new Amistad(5, 1), new Amistad(5, 4), new Amistad(5, 6),
            new Amistad(6, 2), new Amistad(6, 5), new Amistad(6, 7),
            new Amistad(7, 3), new Amistad(7, 6)
        );

        for (Amistad a : amistades) {
            SolicitudAmistad s = new SolicitudAmistad();
            s.setSolicitante(personas.get(a.a()));
            s.setSolicitado(personas.get(a.b()));
            s.setEstado(com.groovelink.entitys.EstadoSolicitud.ACEPTADA);
            s.setFechaSolicitud(LocalDateTime.now().minusDays((long) (10 + Math.random() * 30)));
            solicitudAmistadRepository.save(s);
        }
    }

    private void crearParticipaciones(List<Persona> personas, List<Evento> eventos) {
        log.info("Creando participaciones y likes...");

        record Participacion(int personaIdx, int eventoIdx, boolean meGusta) {}
        List<Participacion> participaciones = List.of(
            new Participacion(0, 0, true), new Participacion(0, 3, true),
            new Participacion(1, 0, true), new Participacion(1, 1, true),
            new Participacion(2, 2, true), new Participacion(2, 5, true),
            new Participacion(3, 4, false),
            new Participacion(4, 5, true), new Participacion(4, 0, true),
            new Participacion(5, 1, true), new Participacion(5, 2, false),
            new Participacion(6, 3, true), new Participacion(6, 4, false),
            new Participacion(7, 4, true)
        );

        for (Participacion p : participaciones) {
            Persona persona = personas.get(p.personaIdx());
            Evento evento = eventos.get(p.eventoIdx());

            PersonaUneEvento pue = new PersonaUneEvento();
            pue.setUsuario(persona);
            pue.setEvento(evento);
            pue.setFechaInscripcion(LocalDateTime.now().minusDays((long) (1 + Math.random() * 5)));
            personaUneEventoRepository.save(pue);

            if (p.meGusta()) {
                PersonaMeGustaEvento pmg = new PersonaMeGustaEvento();
                pmg.setUsuario(persona);
                pmg.setEvento(evento);
                pmg.setFechaMeGusta(LocalDateTime.now().minusDays((long) (1 + Math.random() * 5)));
                personaMeGustaEventoRepository.save(pmg);
            }
        }
    }

    private void crearComentarios(List<Persona> personas, List<Evento> eventos) {
        log.info("Creando comentarios...");

        record Comentario(int personaIdx, int eventoIdx, String texto) {}
        List<Comentario> comentarios = List.of(
            new Comentario(0, 0, "Muy buen evento, lo recomiendo!! El jazz estuvo increible."),
            new Comentario(1, 0, "La semana pasada fui y me encanto. Este finde repito jaja"),
            new Comentario(2, 0, "No pude ir al final pero mis amigos dicen q estuvo muy bien"),
            new Comentario(5, 1, "Aprendimos a hacer pasta, fue super divertido. El tiramisú quedó brutal!"),
            new Comentario(0, 1, "La organizacion fue un poco caotica pero al final se disfruto"),
            new Comentario(4, 2, "Las vistas desde arriba son impresionantes. Merece la pena el madrugón"),
            new Comentario(2, 2, "El año pasado fui y estuvo genial, este año repito seguro"),
            new Comentario(2, 5, "Tocamos hasta las 3 de la mañana jajajaj que buen ambiente"),
            new Comentario(4, 5, "La bateria sonaba que te cagas, menudo pedazo de jam session"),
            new Comentario(6, 3, "Gane el torneo de Mario Kart!! El año q viene os espero para la revancha"),
            new Comentario(7, 4, "Las fotos eran preciosas, muy buen trabajo de los artistas locales")
        );

        for (Comentario c : comentarios) {
            PersonaComentarioEvento pce = new PersonaComentarioEvento();
            pce.setUsuario(personas.get(c.personaIdx()));
            pce.setEvento(eventos.get(c.eventoIdx()));
            pce.setTexto(c.texto());
            pce.setFecha(LocalDateTime.now().minusDays((long) (1 + Math.random() * 3)));
            personaComentarioEventoRepository.save(pce);
        }
    }

    private void crearChatsGrupo(List<Evento> eventos, List<Persona> personas) {
        log.info("Creando chats de grupo para eventos...");

        for (Evento evento : eventos) {
            Chat chat = new Chat();
            chat.setNombre(evento.getNombre());
            chat.setDescripcion("Chat grupal del evento: " + evento.getNombre());
            chat.setEsGrupal(true);
            chat.setEventoId(evento.getId());
            chat.setFechaCreacion(LocalDateTime.now().minusDays(3));
            chat.setParticipantes(new ArrayList<>(personas.stream().map(p -> (Usuario) p).toList()));
            chatRepository.save(chat);
        }
    }

    private void crearMensajes(List<Persona> personas) {
        log.info("Creando mensajes de chat...");

        List<Chat> chats = chatRepository.findAll();
        if (chats.isEmpty()) return;

        record MensajeData(int personaIdx, int chatIdx, String texto, long horasAtras) {}
        List<MensajeData> mensajes = List.of(
            new MensajeData(0, 0, "oye gente al final llego un poco tarde, sobre las 9 y media", 48),
            new MensajeData(1, 0, "tranqui tio, nosotros estamos hasta las tantas", 47),
            new MensajeData(2, 0, "yo llevo la cámara para hacer fotos, el sitio es muy chulo", 24),
            new MensajeData(4, 0, "alguien sabe si hay que pagar entrada?", 12),
            new MensajeData(0, 0, "creo q es gratis pero no estoy seguro del todo", 11),
            new MensajeData(2, 5, "yo llevo la guitarra acustica por si alguien quiere sumarse", 72),
            new MensajeData(4, 5, "yo llevo la bateria electrónica, montamos un pollo! jajaja", 71),
            new MensajeData(2, 2, "chicos el tiempo para el sabado no pinta bien, lluvia toda la mañana", 36),
            new MensajeData(4, 2, "no pasa nada, yo tengo tienda de campaña por si llueve", 35),
            new MensajeData(5, 1, "alguien sabe si hay que llevar algo para el taller de cocina?", 24),
            new MensajeData(1, 1, "solo ganas de comer! ellos ponen los ingredientes", 22),
            new MensajeData(5, 1, "jajajaj perfecto entonces alli nos vemos", 20),
            new MensajeData(6, 3, "yo voy a daros a todos en street fighter eh!!", 18),
            new MensajeData(0, 3, "tu flipas, yo llevo practicando desde que me apunté", 16),
            new MensajeData(6, 3, "pues preparate pq te voy a barrer jajajaj", 14),
            new MensajeData(3, 4, "la expo cuelga mis fotos! estoy super nerviosa", 48),
            new MensajeData(7, 4, "tus fotos son una pasada, vas a triunfar seguro", 36),
            new MensajeData(1, 4, "nosotros vamos el sabado, hay visita guiada no?", 24),
            new MensajeData(3, 4, "si si, a las 12 en la galeria. No llegues tarde q son puntuales!", 12),
            new MensajeData(7, 4, "allí estaremos! con cámara y todo jajaja", 8),
            new MensajeData(2, 0, "acabo de llegar y esto esta petado! no hay sitio", 2),
            new MensajeData(0, 0, "nosotros estamos detras del todo, buscanos!", 1),
            new MensajeData(1, 0, "q bien suena esto!! llegamos en 5 min", 1),
            new MensajeData(4, 5, "al final no voy a poder ir, me surgio un imprevisto :(", 6),
            new MensajeData(2, 5, "noo tio, te vas a perder la mejor jam session del año!", 5),
            new MensajeData(5, 1, "el taller estuvo genial, me lleve las recetas a casa", 48),
            new MensajeData(6, 3, "jajajaj te gané bien eh! reconoce la derrota", 24),
            new MensajeData(0, 3, "la proxima vez me vengooo, esto no se queda asi", 22)
        );

        int chatCount = Math.min(chats.size(), 6);
        for (MensajeData m : mensajes) {
            if (m.chatIdx() >= chatCount) continue;
            Mensaje msg = new Mensaje();
            msg.setUsuario(personas.get(m.personaIdx()));
            msg.setChat(chats.get(m.chatIdx()));
            msg.setContenido(m.texto());
            msg.setFechaEnvio(LocalDateTime.now().minusHours(m.horasAtras()));
            mensajeRepository.save(msg);
        }

        for (int i = 0; i < chatCount; i++) {
            Chat chat = chats.get(i);
            mensajeRepository.findByChat_IdOrderByFechaEnvioAsc(chat.getId())
                .stream()
                .reduce((first, second) -> second)
                .ifPresent(last -> {
                    chat.setUltimoMensaje(last.getFechaEnvio());
                    chatRepository.save(chat);
                });
        }
    }
}
