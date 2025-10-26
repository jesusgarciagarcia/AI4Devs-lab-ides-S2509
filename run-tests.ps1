#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script de automatización para ejecutar todos los tests del proyecto ATS

.DESCRIPTION
    Este script facilita la ejecución de tests:
    - Tests unitarios (backend y frontend)
    - Tests de integración (backend y frontend)
    - Tests E2E (Playwright)

.PARAMETER Type
    Tipo de tests a ejecutar: unit, integration, e2e, all

.PARAMETER Watch
    Ejecutar tests en modo watch (solo para unit)

.PARAMETER Coverage
    Generar reporte de cobertura

.EXAMPLE
    .\run-tests.ps1 -Type unit
    Ejecuta solo tests unitarios

.EXAMPLE
    .\run-tests.ps1 -Type e2e
    Ejecuta tests E2E (levanta servicios automáticamente)

.EXAMPLE
    .\run-tests.ps1 -Type all
    Ejecuta todos los tests del proyecto

.EXAMPLE
    .\run-tests.ps1 -Type unit -Watch
    Ejecuta tests unitarios en modo watch
#>

param(
    [Parameter(Mandatory = $false)]
    [ValidateSet("unit", "integration", "e2e", "all")]
    [string]$Type = "unit",

    [Parameter(Mandatory = $false)]
    [switch]$Watch,

    [Parameter(Mandatory = $false)]
    [switch]$Coverage
)

$ErrorActionPreference = "Stop"

# Colores para output
function Write-Info { param($msg) Write-Host "ℹ️  $msg" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }
function Write-Step { param($msg) Write-Host "`n🔹 $msg" -ForegroundColor Yellow }

Write-Host @"

╔═══════════════════════════════════════╗
║   ATS - Test Automation Script       ║
║   Ejecutando: $Type tests              ║
╚═══════════════════════════════════════╝

"@ -ForegroundColor Magenta

try {
    switch ($Type) {
        "unit" {
            Write-Step "Ejecutando tests unitarios..."
            Write-Info "Backend: tests/unit/**/*.test.ts"
            Write-Info "Frontend: tests/unit/**/*.test.tsx"

            if ($Watch) {
                Write-Info "Modo: Watch"
                npm run test:watch
            }
            elseif ($Coverage) {
                Write-Info "Generando reporte de cobertura..."
                npm run test:coverage
                Write-Success "Reporte de cobertura generado en backend/coverage/ y frontend/coverage/"
            }
            else {
                npm run test:unit
            }
        }

        "integration" {
            Write-Step "Ejecutando tests de integración..."
            Write-Info "Verificando servicios Docker..."

            $dockerRunning = docker ps -q 2>$null
            if (-not $dockerRunning) {
                Write-Info "Levantando servicios Docker..."
                npm run services:up
                Start-Sleep -Seconds 5
            }

            Write-Info "Preparando base de datos..."
            npm run db:prepare

            Write-Info "Ejecutando tests de integración..."
            npm run test:integration
        }

        "e2e" {
            Write-Step "Ejecutando tests E2E (Playwright)..."
            Write-Info "Ubicación: tests/e2e/candidates/*.e2e.test.ts"

            Write-Info "Levantando servicios Docker..."
            npm run services:up
            Start-Sleep -Seconds 5

            Write-Info "Preparando base de datos..."
            npm run db:prepare

            Write-Info "Los servidores backend y frontend se levantarán automáticamente"
            Write-Info "Backend: http://localhost:3010"
            Write-Info "Frontend: http://localhost:3000"

            npm run test:e2e

            Write-Info "`nPara ver el reporte detallado ejecuta: npm run test:e2e:report"
        }

        "all" {
            Write-Step "Ejecutando TODOS los tests del proyecto..."

            Write-Info "1/4 - Tests Unitarios (Backend)"
            npm run test:unit:backend
            Write-Success "Tests unitarios backend completados"

            Write-Info "`n2/4 - Tests Unitarios (Frontend)"
            npm run test:unit:frontend
            Write-Success "Tests unitarios frontend completados"

            Write-Info "`n3/4 - Tests de Integración"
            Write-Info "Levantando servicios Docker..."
            npm run services:up
            Start-Sleep -Seconds 5
            npm run db:prepare
            npm run test:integration
            Write-Success "Tests de integración completados"

            Write-Info "`n4/4 - Tests E2E (Playwright)"
            npm run test:e2e
            Write-Success "Tests E2E completados"

            Write-Info "Deteniendo servicios Docker..."
            npm run services:down
        }
    }

    Write-Host "`n"
    Write-Success "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    Write-Success "  Todos los tests completados exitosamente"
    Write-Success "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

}
catch {
    Write-Host "`n"
    Write-Error "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    Write-Error "  Error durante la ejecución de tests"
    Write-Error "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    Write-Error $_.Exception.Message
    exit 1
}
