# API Landing Page - Setup & Run

Este guia contém as instruções exatas para configurar e rodar o ambiente de desenvolvimento, utilizando Docker (ou Podman) para o banco de dados e Node.js para a aplicação.

## Pré-requisitos

Certifique-se de ter instalado:
- **Node.js** (v18 ou superior) & npm
- **Docker** e **Docker Compose** (ou Podman + podman-compose em distros Fedora/Bazzite)

---

## Passo a Passo (Setup Inicial)

### 1. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto. Sem isso, a aplicação **não iniciará**.

```bash
cp .env.example .env
# Ou crie manualmente com o conteúdo abaixo:

```

**Conteúdo obrigatório do `.env`:**

```env
# Porta do Servidor
PORT=3001

# Segredo para assinatura dos tokens JWT (use uma string longa e aleatória)
JWT_SECRET="sua_chave_secreta_aqui_12345"

# Conexão com o MongoDB (Docker)
# Formato: mongodb://<user>:<password>@localhost:27017/<database>?authSource=admin
DATABASE_URL="mongodb://root:examplepassword@localhost:27017/landing-page?authSource=admin"

```

### 2. Subir a Infraestrutura (Banco de Dados)

Não instale o MongoDB localmente. Use o Docker/Podman para manter seu sistema limpo.

Certifique-se de que o arquivo `docker-compose.yml` existe na raiz.

**Para usuários Docker:**

```bash
sudo dockerd
# Em outro terminal:
sudo docker-compose up -d
```

*Verifique se o container está rodando:*

```bash
docker ps
# Deve mostrar o container 'landing-page-mongo' com status 'Up'

```

### 3. Instalar Dependências

Baixe as bibliotecas necessárias listadas no `package.json`.

```bash
npm install

```

---

## Rodando a Aplicação

Para iniciar o servidor em modo de desenvolvimento (com hot-reload via `ts-node-dev`):

```bash
npm run devStart

```

O terminal deve exibir:

> Conectado ao MongoDB
> Server iniciado na porta 3001

---

## Troubleshooting (Resolução de Problemas)

**Erro: `permission denied` ao rodar docker**

* Seu usuário não tem permissão no socket do Docker.
* **Solução rápida:** Rode com `sudo docker-compose up -d`.

**Erro: `connection refused` no Mongo**

* Verifique se o container caiu (`docker ps -a`).
* Verifique se a porta `27017` não está sendo usada por outro serviço.

**Erro: `JWT_SECRET não está definido**`

* Você esqueceu de criar o arquivo `.env` ou não salvou as alterações.

---

## Estrutura do Docker Compose

O arquivo `docker-compose.yml` sobe um MongoDB (imagem `mongo`) com as seguintes credenciais padrão (para dev):

* **User:** root
* **Pass:** examplepassword
* **Port:** 27017
* **Volume:** Persistente em `mongo-data`

---

## Variáveis opcionais e primeiro usuário

O `.env.example` inclui variáveis usadas por outros recursos:

| Variável | Uso |
|----------|-----|
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Upload de fotos de produtos (Cloudinary). Sem elas, criar/editar produtos com fotos falha. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Criação do primeiro usuário admin. |

**Criar o usuário admin** (após MongoDB rodando e `.env` configurado):

```bash
npx ts-node scripts/create_admin.ts
```

O script cria um usuário com o email e senha definidos em `ADMIN_EMAIL` e `ADMIN_PASSWORD`. Execute apenas uma vez (ou quando quiser resetar a senha do admin).
