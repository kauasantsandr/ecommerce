package com.fatec.ams.service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    private static final String SECRET = "pombo-games-secret-key-2026-valor-seguro";
    private static final long EXPIRATION_MS = 1000L * 60 * 60 * 8;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String email, String usuario) {
        return Jwts.builder()
            .subject(email)
            .claim("usuario", usuario)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
            .signWith(getKey())
            .compact();
    }
}