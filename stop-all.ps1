# stop-all.ps1
# Detiene todos los servicios del proyecto GWS Wine

Write-Host " Deteniendo todos los servicios..." -ForegroundColor Red
Write-Host "=====================================" -ForegroundColor Cyan

# Matar procesos de Node.js
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "✅ Procesos Node.js detenidos" -ForegroundColor Green

# Matar procesos de PowerShell (las ventanas abiertas)
Get-Process -Name "powershell" -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -match "Prisma|API|Frontend|Admin" } | Stop-Process -Force
Write-Host "✅ Ventanas de servicios cerradas" -ForegroundColor Green

# Matar procesos en puertos específicos (por si quedan colgados)
$ports = @(3000, 3001, 4000, 5555)
foreach ($port in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        $pid = $connection.OwningProcess | Select-Object -Unique
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Puerto $port liberado" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🎉 Todos los servicios detenidos" -ForegroundColor Green
Write-Host "Presiona Enter para salir..."
Read-Host