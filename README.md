<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  # 📝 Blog/CMS API com NestJS, JWT e Prisma

## 💡 Description

Este projeto é uma API RESTful robusta desenvolvida com **NestJS** para gerenciar usuários e conteúdo (Artigos). Ele demonstra as melhores práticas de desenvolvimento *backend*, incluindo segurança, validação de dados e ORM moderno.

### Principais Funcionalidades

* **Autenticação JWT:** Login seguro e rotas protegidas por tokens.
* **Autorização Baseada em Roles (RBAC):** Uso de `RolesGuard` para restringir o acesso a rotas específicas (Admin, Editor, Reader).
* **CRUD de Artigos:** Gestão de artigos, permitindo rascunhos (`isPublished: false`) e listagem pública.
* **CRUD de Usuários:** Criação e gestão de contas com diferentes níveis de permissão.
* **Persistência de Dados:** Utiliza **Prisma ORM** e **PostgreSQL** para o banco de dados.

### Tecnologias Utilizadas

| Tecnologia | Descrição |
| :--- | :--- |
| **NestJS** | Framework Node.js progressivo para aplicações *server-side*. |
| **Prisma ORM** | ORM moderno para interação segura e tipada com o banco de dados. |
| **PostgreSQL** | Banco de dados relacional. |
| **JWT (JSON Web Token)** | Mecanismo de autenticação *stateless*. |
| **Bcrypt** | Hashing de senhas seguro. |
| **Swagger** | Documentação automática da API. |

## ⚙️ Configuração do Projeto

### Pré-requisitos

Você precisará de:
* Node.js (v18+)
* Docker e Docker Compose (Recomendado para rodar o PostgreSQL)

### 1. Clonar e Instalar

```bash
git clone SEU_URL_DO_REPOSITORIO
cd nome-do-seu-projeto
npm install
2. Configurar o Banco de Dados (Docker Compose)
Certifique-se de ter um arquivo .env na raiz do projeto configurando as variáveis de ambiente, incluindo o DATABASE_URL (tipicamente para o PostgreSQL).

Bash

# Se usar Docker, inicie o container do PostgreSQL:
docker-compose up -d
3. Migrar e Gerar o Prisma Client
Após configurar o banco de dados, execute as migrações e gere o cliente do Prisma:

Bash

# Executa as migrações (cria as tabelas User, Article, Permission)
npx prisma migrate dev --name init

# Gera o cliente Prisma (se necessário)
npx prisma generate
4. Seed (Opcional, mas Recomendado)
Se você tiver um script de seed para criar as permissões (ADMIN, EDITOR, READER), execute-o para ter dados iniciais:

Bash

npx prisma db seed
🚀 Como Rodar o Projeto
Bash

# development
$ npm run start

# watch mode (recomendado para desenvolvimento)
$ npm run start:dev

# production mode
$ npm run start:prod
O servidor estará disponível em http://localhost:3000.

Documentação da API (Swagger)
A documentação interativa da API estará disponível em:

http://localhost:3000/api

🧪 Rodar Testes
Bash

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
Recursos
Check out a few resources that may come in handy when working with NestJS:

Visit the NestJS Documentation to learn more about the framework.

For questions and support, please visit our Discord channel.

To dive deeper and get more hands-on experience, check out our official video courses.

Deploy your application to AWS with the help of NestJS Mau in just a few clicks.

Visualize your application graph and interact with the NestJS application in real-time using NestJS Devtools.

Need help with your project (part-time to full-time)? Check out our official enterprise support.

To stay in the loop and get updates, follow us on X and LinkedIn.

Looking for a job, or have a job to offer? Check out our official Jobs board.

Support
Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please read more here.

Stay in touch
Author - Kamil Myśliwiec

Website - https://nestjs.com

Twitter - @nestframework

License
Nest is MIT licensed.