# GWS Wine Platform

Plataforma de e-commerce premium para vinos y licores.

## Stack Tecnológico

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: NestJS, GraphQL, Prisma
- **Base de Datos**: PostgreSQL 16
- **Cache**: Redis 7
- **Búsqueda**: Meilisearch
- **Pagos**: Stripe
- **Monorepo**: Turborepo + pnpm

## Requisitos

- Node.js >= 20.0.0
- pnpm >= 9.7.0
- Docker y Docker Compose

## Instalación

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd gws-wine-platform

# 2. Instalar dependencias
pnpm install

# 3. Copiar variables de entorno
cp .env.example .env

# 4. Iniciar servicios (PostgreSQL, Redis, Meilisearch)
docker-compose up -d

# 5. Generar cliente Prisma
pnpm db:generate

# 6. Aplicar migraciones
pnpm db:push

# 7. Iniciar todos los servicios en desarrollo
pnpm dev