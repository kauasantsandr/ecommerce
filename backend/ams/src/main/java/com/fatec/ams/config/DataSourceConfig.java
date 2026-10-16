package com.fatec.ams.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.sql.Connection;

@Configuration
public class DataSourceConfig {
    private static final Logger logger = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:}")
    private String pgUrl;

    @Value("${spring.datasource.username:}")
    private String pgUser;

    @Value("${spring.datasource.password:}")
    private String pgPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        if (pgUrl == null || pgUrl.isBlank()) {
            throw new IllegalStateException("JDBC_DATABASE_URL não configurada. Configure o banco PostgreSQL da loja antes de iniciar o backend.");
        }

        try {
            logger.info("Attempting to connect to Postgres at {}", pgUrl);
            HikariConfig cfg = new HikariConfig();
            cfg.setJdbcUrl(pgUrl);
            if (pgUser != null && !pgUser.isBlank()) {
                cfg.setUsername(pgUser);
            }
            if (pgPassword != null && !pgPassword.isBlank()) {
                cfg.setPassword(pgPassword);
            }
            cfg.setDriverClassName("org.postgresql.Driver");
            cfg.setMaximumPoolSize(5);

            HikariDataSource ds = new HikariDataSource(cfg);
            try (Connection c = ds.getConnection()) {
                if (c != null && !c.isClosed()) {
                    logger.info("Connected to Postgres successfully.");
                    return ds;
                }
            }

            ds.close();
            throw new IllegalStateException("Não foi possível validar a conexão com o PostgreSQL em " + pgUrl + ". Verifique usuario, senha e banco lojavirtual_db.");
        } catch (Exception ex) {
            logger.error("Postgres connection failed: {}", ex.getMessage());
            throw new IllegalStateException("Falha ao conectar ao PostgreSQL. Configure as variáveis JDBC_DATABASE_URL, JDBC_DATABASE_USERNAME e JDBC_DATABASE_PASSWORD.", ex);
        }
    }
}
