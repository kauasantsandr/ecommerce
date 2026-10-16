package com.fatec.ams.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fatec.ams.model.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    Optional<Cliente> findByEmail(String email);

    Optional<Cliente> findByUsuario(String usuario);

    @Query("select c from Cliente c where c.email = :email and c.senha = :senha")
    Optional<Cliente> fazerLogin(@Param("email") String email, @Param("senha") String senha);
}
