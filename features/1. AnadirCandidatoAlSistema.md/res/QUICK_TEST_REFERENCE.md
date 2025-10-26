# 🚀 Quick Reference - Running Tests

## Comandos Rápidos

### Tests Unitarios (Sin Docker, rápido ⚡)

```bash
npm run test:unit
```

Backend: ~5 segundos | Frontend: ~20 segundos

### Tests de Integración (Requiere Docker 🐳)

```bash
# 1. Levantar servicios
npm run services:up

# 2. Preparar DB
npm run db:prepare

# 3. Ejecutar tests
npm run test:integration
```

### Tests E2E (Requiere Docker + Servicios 🌐)

```bash
# El script levanta servicios automáticamente
npm run test:e2e

# Ver reporte después
npm run test:e2e:report
```

### TODO de una vez 🎯

```bash
# Windows
.\run-tests.ps1 -Type all

# Linux/Mac
./run-tests.sh all
```

## Estado Actual

✅ Backend: 24/24 tests pasando
⚠️ Frontend: 54/57 tests pasando (3 necesitan atención)
📦 Estructura: Reorganizada y limpia
🤖 Automatización: Implementada

## Archivos Importantes

- 📖 `TESTING.md` - Guía completa
- 📋 `TEST_REORGANIZATION_SUMMARY.md` - Resumen del trabajo
- ⚡ `run-tests.ps1` / `run-tests.sh` - Scripts de automatización
