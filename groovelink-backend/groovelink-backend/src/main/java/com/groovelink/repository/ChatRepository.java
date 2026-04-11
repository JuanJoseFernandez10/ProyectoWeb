package com.groovelink.repository;

import com.groovelink.entitys.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findByParticipantes_Id(Long usuarioId);

    @Query("SELECT c FROM Chat c WHERE :usuarioId MEMBER OF c.participantes AND c.esGrupal = false")
    List<Chat> findChatsIndividualesDeUsuario(@Param("usuarioId") Long usuarioId);
}