```markdown
# API Landing Page - Setup & Run

Este guia contém as instruções exatas para configurar e rodar o ambiente de desenvolvimento, utilizando Docker (ou Podman) para o banco de dados e Node.js para a aplicação.

## ?? Pré-requisitos

Certifique-se de ter instalado:
- **Node.js** (v18 ou superior) & npm
- **Docker** e **Docker Compose** (ou Podman + podman-compose em distros Fedora/Bazzite)

---

## ?? Passo a Passo (Setup Inicial)

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

Run 
```bash
sudo dockerd

```
And 

```bash
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

## ?? Rodando a Aplicação

Para iniciar o servidor em modo de desenvolvimento (com hot-reload via `ts-node-dev`):

```bash
npm run devStart

```

O terminal deve exibir:

> Server Started on port 3001
> Connected to Database

---

## ?? Troubleshooting (Resolução de Problemas)

**Erro: `permission denied` ao rodar docker**

* Seu usuário não tem permissão no socket do Docker.
* **Solução rápida:** Rode com `sudo docker-compose up -d`.

**Erro: `connection refused` no Mongo**

* Verifique se o container caiu (`docker ps -a`).
* Verifique se a porta `27017` não está sendo usada por outro serviço.

**Erro: `JWT_SECRET não está definido**`

* Você esqueceu de criar o arquivo `.env` ou não salvou as alterações.

---

## ?? Estrutura do Docker Compose

O arquivo `docker-compose.yml` sobe um MongoDB 7.0 com as seguintes credenciais padrão (para dev):

* **User:** root
* **Pass:** examplepassword
* **Port:** 27017
* **Volume:** Persistente em `mongo-data`

```
