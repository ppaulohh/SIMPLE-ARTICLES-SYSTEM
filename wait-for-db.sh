#!/bin/bash
# wait-for-db.sh - Script de inicialização robusto para Prisma 7+

set -e

HOST="db" 
PORT="5432" 

echo "Aguardando o serviço de banco de dados em $HOST:$PORT..."

# Loop de espera com netcat
while ! nc -z $HOST $PORT; do
	sleep 1
done

echo "Banco de dados pronto. Executando deploy de migrações, generate, seed e iniciando o servidor..."

# --- Execução dos Comandos do Prisma ---

# 1. Aplica as migrações existentes.
echo "Aplicando migrações..."
npx prisma migrate deploy 

# 2. GERA o Cliente Prisma NOVAMENTE 
echo "Gerando Prisma Client para o ambiente do container..."
npx prisma generate 

# 3. Executa o Seed (COMANDO CORRIGIDO)
echo "Executando Seed..."
# Usamos 'npx prisma db seed' para garantir que ele use o ENVIRONMENT.
# Este comando respeita a configuração "prisma.seed" do package.json.
npx prisma db seed 

# 4. Inicia a aplicação NestJS
echo "Iniciando aplicação NestJS em modo dev..."
npm run start:dev