# Pombo Games

E-commerce de eletrônicos e acessórios gamer, com frontend Angular e backend Spring Boot + PostgreSQL.

## Estrutura do projeto

- frontend/: aplicação Angular
- backend/ams/: backend Spring Boot
- backend/ams/sql/: scripts SQL para criar e restaurar o banco

## Requisitos

- Java 17+
- Maven
- Node.js 18+
- PostgreSQL 15+
- Angular CLI (opcional para desenvolvimento local)

## Banco de dados

Crie um banco PostgreSQL chamado `lojavirtual_db` e execute o script:

```bash
psql -U postgres -d lojavirtual_db -f backend/ams/sql/loja_virtual_full.sql
```

Ou, se quiser criar apenas o schema e deixar os dados later, use:

```bash
psql -U postgres -d lojavirtual_db -f backend/ams/sql/setup_loja_virtual.sql
```

## Backend

Entre na pasta do backend:

```bash
cd backend/ams
```

Configure as variáveis de ambiente, se necessário:

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=lojavirtual_db
export DB_USER=postgres
export DB_PASSWORD=postgres
```

No Windows PowerShell:

```powershell
$env:DB_HOST='localhost'
$env:DB_PORT='5432'
$env:DB_NAME='lojavirtual_db'
$env:DB_USER='postgres'
$env:DB_PASSWORD='postgres'
```

Inicie o backend:

```bash
./mvnw spring-boot:run
```

O backend deve ficar em:

```txt
http://localhost:8081
```

## Frontend

Na pasta do frontend:

```bash
cd frontend
npm install
npm start
```

O frontend fica em:

```txt
http://localhost:4200
```

## Usuários padrão

Admin:
- e-mail: admin@loja.com
- senha: Admin@123

Cliente:
- e-mail: maria@email.com
- senha: Maria@123

## Observações

- A aplicação foi adaptada para uso didático com PostgreSQL.
- A página inicial é a vitrine principal.
- O app usa imagens locais em `/uploads` e o backend expõe esses arquivos via static resource.

## Docker

O projeto inclui setup para rodar com Docker em outra máquina, porém o ambiente atual não validou a execução com Docker porque o Docker não está instalado aqui.

Para rodar com Docker do projeto:

```bash
docker compose up --build
```

Se a máquina possuir Docker Desktop ou Docker Engine funcionando, o projeto deverá subir com PostgreSQL + backend + frontend.
