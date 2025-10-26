#!/bin/bash
#
# Script de automatización para ejecutar todos los tests del proyecto ATS
#
# Uso:
#   ./run-tests.sh unit          - Ejecuta tests unitarios
#   ./run-tests.sh integration   - Ejecuta tests de integración
#   ./run-tests.sh e2e           - Ejecuta tests E2E
#   ./run-tests.sh all           - Ejecuta todos los tests
#   ./run-tests.sh unit --watch  - Ejecuta tests unitarios en modo watch
#   ./run-tests.sh unit --coverage - Genera reporte de cobertura

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Funciones de utilidad
info() { echo -e "${CYAN}ℹ️  $1${NC}"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
step() { echo -e "\n${YELLOW}🔹 $1${NC}"; }

# Configuración
TYPE=${1:-unit}
WATCH=${2:-}

echo -e "${MAGENTA}"
cat << "EOF"

╔═══════════════════════════════════════╗
║   ATS - Test Automation Script       ║
╚═══════════════════════════════════════╝

EOF
echo -e "${NC}"

info "Ejecutando: $TYPE tests"

case "$TYPE" in
    unit)
        step "Ejecutando tests unitarios..."
        info "Backend: tests/unit/**/*.test.ts"
        info "Frontend: tests/unit/**/*.test.tsx"

        if [ "$WATCH" = "--watch" ]; then
            info "Modo: Watch"
            npm run test:watch
        elif [ "$WATCH" = "--coverage" ]; then
            info "Generando reporte de cobertura..."
            npm run test:coverage
            success "Reporte de cobertura generado en backend/coverage/ y frontend/coverage/"
        else
            npm run test:unit
        fi
        ;;

    integration)
        step "Ejecutando tests de integración..."
        info "Verificando servicios Docker..."

        if ! docker ps -q &> /dev/null; then
            info "Levantando servicios Docker..."
            npm run services:up
            sleep 5
        fi

        info "Preparando base de datos..."
        npm run db:prepare

        info "Ejecutando tests de integración..."
        npm run test:integration
        ;;

    e2e)
        step "Ejecutando tests E2E (Playwright)..."
        info "Ubicación: tests/e2e/candidates/*.e2e.test.ts"

        info "Levantando servicios Docker..."
        npm run services:up
        sleep 5

        info "Preparando base de datos..."
        npm run db:prepare

        info "Los servidores backend y frontend se levantarán automáticamente"
        info "Backend: http://localhost:3010"
        info "Frontend: http://localhost:3000"

        npm run test:e2e

        info "\nPara ver el reporte detallado ejecuta: npm run test:e2e:report"
        ;;

    all)
        step "Ejecutando TODOS los tests del proyecto..."

        info "1/4 - Tests Unitarios (Backend)"
        npm run test:unit:backend
        success "Tests unitarios backend completados"

        info "\n2/4 - Tests Unitarios (Frontend)"
        npm run test:unit:frontend
        success "Tests unitarios frontend completados"

        info "\n3/4 - Tests de Integración"
        info "Levantando servicios Docker..."
        npm run services:up
        sleep 5
        npm run db:prepare
        npm run test:integration
        success "Tests de integración completados"

        info "\n4/4 - Tests E2E (Playwright)"
        npm run test:e2e
        success "Tests E2E completados"

        info "Deteniendo servicios Docker..."
        npm run services:down
        ;;

    *)
        error "Tipo de test no válido: $TYPE"
        echo "Uso: ./run-tests.sh [unit|integration|e2e|all] [--watch|--coverage]"
        exit 1
        ;;
esac

echo ""
success "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
success "  Todos los tests completados exitosamente"
success "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
