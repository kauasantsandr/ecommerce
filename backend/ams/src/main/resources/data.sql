-- insert clients if not exists (compatible with Postgres and H2)
INSERT INTO cliente (usuario, email, senha, role)
SELECT 'adminloja', 'admin@loja.com', 'Admin@123', 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM cliente WHERE email = 'admin@loja.com');

INSERT INTO cliente (usuario, email, senha, role)
SELECT 'mariasilva', 'maria@email.com', 'Maria@123', 'USER'
WHERE NOT EXISTS (SELECT 1 FROM cliente WHERE email = 'maria@email.com');

-- insert products if not exists
INSERT INTO produto (nome, descritivo, valor, valor_promo, quantidade, destaque, imagem)
SELECT 'Notebook Lenovo', 'Notebook Lenovo com desempenho para trabalho, estudo e produtividade.', 4999.00, 4299.00, 10, 1, '/uploads/lenovo.jpg'
WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome = 'Notebook Lenovo');

INSERT INTO produto (nome, descritivo, valor, valor_promo, quantidade, destaque, imagem)
SELECT 'Teclado Wooting 80HE', 'Teclado mecânico premium com switches analógicos e layout compacto.', 5899.00, 5199.00, 8, 1, '/uploads/wooting.jpg'
WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome = 'Teclado Wooting 80HE');
