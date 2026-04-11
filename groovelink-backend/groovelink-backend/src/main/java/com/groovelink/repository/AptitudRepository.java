package com.groovelink.repository;

import com.groovelink.entitys.Aptitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AptitudRepository extends JpaRepository<Aptitud, Long> {
    Optional<Aptitud> findByNombre(String nombre);
}