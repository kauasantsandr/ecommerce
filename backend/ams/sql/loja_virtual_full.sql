BEGIN;

DROP TABLE IF EXISTS produto CASCADE;
DROP TABLE IF EXISTS cliente CASCADE;

CREATE TABLE cliente (
    codigo SERIAL PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER'
);

CREATE TABLE produto (
    codigo SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descritivo TEXT,
    valor DOUBLE PRECISION NOT NULL DEFAULT 0,
    valor_promo DOUBLE PRECISION NOT NULL DEFAULT 0,
    quantidade INTEGER NOT NULL DEFAULT 0,
    destaque INTEGER NOT NULL DEFAULT 1,
    imagem VARCHAR(255)
);

INSERT INTO cliente (usuario, email, senha, role)
VALUES
    ('adminloja', 'admin@loja.com', 'Admin@123', 'ADMIN'),
    ('mariasilva', 'maria@email.com', 'Maria@123', 'USER');

INSERT INTO produto (nome, descritivo, valor, valor_promo, quantidade, destaque, imagem)
VALUES
    ('Notebook Lenovo', 'Notebook Lenovo com desempenho para trabalho, estudo e produtividade.', 4999.00, 4299.00, 10, 1, '/uploads/33c7ed96-5891-4c3d-b3a4-ed974cc8b452.png'),
    ('Teclado Wooting 80HE', 'Teclado mecânico premium com switches analógicos e layout compacto.', 5899.00, 5199.00, 8, 1, 'ba4f13e9-5442-41dc-924f-3fd2ee07437c.png');

COMMIT;

SELECT * FROM cliente;
SELECT * FROM produto;
