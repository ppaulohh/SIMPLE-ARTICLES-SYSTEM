# ==================================
# STAGE 1: DEVELOPMENT (Versão Node 20)
# ==================================
FROM node:20-alpine AS development

WORKDIR /app

# 0. Instalação de utilitários necessários para o script de espera
# netcat (nc) para verificar a porta do DB e bash para rodar o script
RUN apk add --no-cache netcat-openbsd bash 

# 1. Copia arquivos de dependência
COPY package*.json ./

# 2. COPIA O DIRETÓRIO PRISMA (Contém schema e migrações)
COPY prisma ./prisma 

# 3. Instala as dependências
RUN npm install

# 4. GERA OS BINÁRIOS DO PRISMA (Isto também é feito no script, mas ter aqui garante o cliente)
RUN npx prisma generate

# 5. Copia o script de espera e inicialização
COPY wait-for-db.sh . 
RUN chmod +x wait-for-db.sh

# 6. Copia o restante do código (arquivos .ts, .env, etc.)
COPY . .

EXPOSE 3000

# O CMD é ignorado pelo Entrypoint no Compose, mas é um fallback
CMD ["npm", "run", "start:dev"]


# ==================================
# STAGE 2: PRODUCTION (Sem alteração)
# ==================================
FROM node:20-alpine AS production

WORKDIR /app

# 1. Copia arquivos de dependência
COPY package*.json ./
# 2. COPIA O DIRETÓRIO PRISMA (CRÍTICO)
COPY prisma ./prisma 

# 3. Instala dependências de produção
# Adiciona utilitários se necessário para o binário do Prisma
RUN apk add --no-cache bash 
RUN npm install --only=production

# 4. GERA OS BINÁRIOS DO PRISMA (Crucial para produção)
RUN npx prisma generate

# 5. Copia o código e compila
COPY . .
RUN npm run build
# Usa o ENTRYPOINT 'wait-for-db.sh' (se você usasse em prod) ou CMD para iniciar o código compilado
CMD ["node", "dist/main"]