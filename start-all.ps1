# start-all.ps1
# Script para levantar todos los servicios del proyecto GWS Wine

Write-Host "🍷 Iniciando GWS Wine Platform..." -ForegroundColor Magenta
Write-Host "=====================================" -ForegroundColor Cyan

# Función para abrir nueva ventana de PowerShell
function Start-Service {
    param(
        [string]$Name,
        [string]$Path,
        [string]$Command,
        [string]$Color
    )
    
    Write-Host " Iniciando $Name..." -ForegroundColor $Color
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Path'; $Command; Read-Host 'Presiona Enter para cerrar'"
    Start-Sleep -Seconds 2
}

# 1. Base de Datos (Prisma Studio)
Start-Service -Name "Base de Datos (Prisma Studio)" -Path "$PSScriptRoot\packages\database" -Command "pnpm db:studio" -Color "Yellow"

# 2. API (NestJS)
Start-Service -Name "API (NestJS - Puerto 4000)" -Path "$PSScriptRoot\apps\api" -Command "npm run start:dev" -Color "Green"

# Esperar un poco para que la API inicie antes que los frontends
Write-Host "⏳ Esperando 5 segundos para que la API inicie..." -ForegroundColor DarkYellow
Start-Sleep -Seconds 5

# 3. Frontend Web (Next.js)
Start-Service -Name "Frontend Web (Next.js - Puerto 3000)" -Path "$PSScriptRoot\apps\web" -Command "npm run dev" -Color "Blue"

# 4. Panel Admin (Vite)
Start-Service -Name "Panel Admin (Vite - Puerto 3001)" -Path "$PSScriptRoot\apps\admin" -Command "npm run dev" -Color "Cyan"

Write-Host ""
Write-Host "✅ Todos los servicios están iniciando..." -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "📊 Prisma Studio: http://localhost:5555" -ForegroundColor Yellow
Write-Host "🔌 API GraphQL:     http://localhost:4000/graphql" -ForegroundColor Green
Write-Host " Frontend Web:    http://localhost:3000" -ForegroundColor Blue
Write-Host "⚙️  Panel Admin:     http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host " Presiona Ctrl+C en cada ventana para detener un servicio" -ForegroundColor DarkGray
Write-Host "🛑 Para detener todo, cierra todas las ventanas de PowerShell" -ForegroundColor Red