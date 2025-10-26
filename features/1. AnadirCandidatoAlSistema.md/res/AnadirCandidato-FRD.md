# 🧩 **Añadir Candidato al Sistema - Documento de Requisitos Funcionales (FRD)**

**Proyecto:** *¡Cazatalentos Digital! 🎯 - Sistema de Captación de Candidatos Express*
**Versión:** 1.0
**Fecha:** 2025-10-26
**Autor:** Product Owner ATS Team

---

## 🧭 Tabla de Contenidos

1. [Contexto del Negocio](#1-contexto-del-negocio)
2. [User Stories Principales](#2-user-stories-principales)
3. [Criterios de Aceptación](#3-criterios-de-aceptación-detallados)
4. [Casos de Uso](#4-casos-de-uso)
5. [Requisitos No Funcionales](#5-requisitos-no-funcionales)
6. [Matriz de Priorización (MoSCoW)](#6-matriz-de-priorización-moscow)
7. [Definición de Done (DoD)](#7-definición-de-done-dod)
8. [Métricas de Éxito](#8-métricas-de-éxito)
9. [Wireframes Conceptuales](#9-wireframes-conceptuales)
10. [Matriz de Decisiones](#10-matriz-de-decisiones)

---

## 1. Contexto del Negocio

### 🔍 Problema Actual

Los reclutadores invierten demasiado tiempo en ingresar manualmente candidatos. Los formularios actuales son lentos, con validaciones inconsistentes y poca claridad en los mensajes de error.

### 💡 Impacto Esperado

* Reducción del tiempo de carga de candidatos en un **40%**
* Mejora del **SUS (System Usability Score)** por encima de **80/100**
* Incremento de la tasa de completitud del formulario en un **30%**

### 👥 Stakeholders Involucrados

| Rol                | Responsabilidad                                    |
| ------------------ | -------------------------------------------------- |
| Product Owner      | Definir y priorizar requisitos                     |
| UX/UI Designer     | Diseñar flujo y formularios accesibles             |
| Frontend Developer | Implementar la interfaz y validaciones             |
| Backend Developer  | Gestionar persistencia y validaciones server-side  |
| QA Engineer        | Garantizar cumplimiento de criterios de aceptación |
| Legal Officer      | Supervisar cumplimiento GDPR/CCPA                  |

---

## 2. User Stories Principales

### 🧩 Historia Principal

**Como** reclutador, **quiero** añadir un nuevo candidato al sistema **para** registrarlo en procesos de selección futuros.

#### Criterios INVEST

* **I**ndependent: Puede desarrollarse y testearse de forma autónoma
* **N**egotiable: Campos adicionales o integraciones pueden ajustarse
* **V**aluable: Ahorra tiempo al usuario y evita errores humanos
* **E**stimable: Estimable en un sprint
* **S**mall: Implementable en menos de 3 días
* **T**estable: Validaciones funcionales y de UI medibles

---

### 🧩 Historias Derivadas

1. **Validación de Datos**

   * Como reclutador, quiero que el sistema valide formato de email y teléfono para evitar errores en el registro.
2. **Subida de CV**

   * Como reclutador, quiero subir un CV en formato PDF o DOCX (máx. 5MB) para asociarlo al perfil del candidato.
3. **Prevención de Duplicados**

   * Como reclutador, quiero recibir una alerta si intento registrar un candidato ya existente por email.
4. **Manejo de Errores**

   * Como reclutador, quiero ver mensajes de error específicos y claros si el formulario falla.
5. **Registro sin CV**

   * Como reclutador, quiero poder registrar un candidato sin CV para completarlo posteriormente.

---

## 3. Criterios de Aceptación Detallados

### Historia 1: Registro Básico

| Given                                              | When                                                        | Then                                                      |
| -------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------- |
| El reclutador abre el formulario “Nuevo Candidato” | Completa los 7 campos obligatorios y hace clic en “Guardar” | El sistema guarda el candidato y muestra mensaje de éxito |
| El reclutador omite un campo obligatorio           | Intenta enviar el formulario                                | El sistema indica qué campo falta completar               |

### Historia 2: Validaciones

| Given                                                         | When                   | Then                                                              |
| ------------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------- |
| El reclutador introduce un email inválido                     | Hace clic en “Guardar” | Se muestra “El correo electrónico no tiene un formato válido”     |
| El reclutador introduce un teléfono sin prefijo internacional | Hace clic en “Guardar” | Se muestra “El número debe estar en formato internacional (+34…)” |

### Historia 3: Subida de CV

| Given                                | When                   | Then                                                                    |
| ------------------------------------ | ---------------------- | ----------------------------------------------------------------------- |
| El reclutador sube un PDF < 5MB      | Hace clic en “Guardar” | El CV se guarda correctamente                                           |
| El reclutador sube un archivo de 6MB | Hace clic en “Guardar” | El sistema muestra “El archivo excede el tamaño máximo permitido (5MB)” |

### Historia 4: Candidato Duplicado

| Given                               | When                                    | Then                                               |
| ----------------------------------- | --------------------------------------- | -------------------------------------------------- |
| El email ya existe en base de datos | Se intenta registrar un nuevo candidato | Se muestra “Ya existe un candidato con este email” |

### Historia 5: Registro sin CV

| Given                          | When                   | Then                                                           |
| ------------------------------ | ---------------------- | -------------------------------------------------------------- |
| El reclutador no adjunta un CV | Hace clic en “Guardar” | El sistema registra el candidato con estatus “Pendiente de CV” |

---

## 4. Casos de Uso

### Caso 1: Registro Exitoso

**Flujo:**

1. Reclutador abre el formulario
2. Completa los 7 campos obligatorios
3. Sube CV (opcional)
4. Hace clic en “Guardar”
5. Sistema valida → Guarda → Muestra mensaje “Candidato añadido correctamente ✅”

---

### Caso 2: Errores de Validación

1. Reclutador deja un campo vacío
2. Sistema muestra error visual con tooltip rojo y texto “Campo obligatorio”

---

### Caso 3: Fallo de Red

1. Reclutador envía formulario
2. Se interrumpe conexión
3. Sistema muestra banner “Error de conexión. Inténtalo más tarde”
4. No se pierde la información ingresada (persistencia local temporal)

---

### Caso 4: CV Duplicado

1. Reclutador intenta registrar un candidato existente
2. Sistema detecta duplicado por email
3. Muestra diálogo: “El candidato ya existe. ¿Deseas abrir su perfil?”

---

### Caso 5: Registro sin CV

1. Reclutador rellena datos básicos
2. Omite CV
3. Guarda con éxito → Estado del candidato = “Pendiente de CV”

---

## 5. Requisitos No Funcionales

| Categoría                   | Requisito                                                    |
| --------------------------- | ------------------------------------------------------------ |
| ⏱ **Performance**           | Tiempo de respuesta < **2s** y carga del formulario < **1s** |
| 🔒 **Seguridad**            | Cifrado AES-256 en reposo, TLS 1.3 en tránsito               |
| ⚖️ **Cumplimiento Legal**   | GDPR y CCPA completos                                        |
| ♿ **Accesibilidad**         | WCAG 2.1 nivel AA                                            |
| 📱 **Usabilidad**           | SUS > 80; Responsive Design (mobile-first)                   |
| 🌍 **Internacionalización** | Soporte futuro i18n para español/inglés                      |
| 🧠 **Escalabilidad**        | Capaz de procesar 500 formularios/día sin degradación        |

---

## 6. Matriz de Priorización (MoSCoW)

| Categoría       | Funcionalidades                                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Must Have**   | Campos obligatorios, validación email/teléfono, subida CV, detección duplicados, feedback de error, cumplimiento GDPR |
| **Should Have** | Persistencia offline temporal, confirmación visual de éxito, logs de auditoría                                        |
| **Could Have**  | Autocompletado de ciudad/país, preview del CV antes de guardar                                                        |
| **Won’t Have**  | Integración LinkedIn o parsing automático (futuro release)                                                            |

---

## 7. Definición de Done (DoD)

* [x] Todos los criterios de aceptación superados
* [x] Pruebas unitarias y de integración completadas
* [x] Código revisado y aprobado en PR
* [x] Validación UX y accesibilidad WCAG 2.1
* [x] Logs y auditoría implementados
* [x] Cumplimiento legal verificado
* [x] Documentación API actualizada
* [x] Despliegue en entorno staging validado

---

## 8. Métricas de Éxito

| Métrica                        | Objetivo      | Método                  |
| ------------------------------ | ------------- | ----------------------- |
| ⏳ Tiempo medio de registro     | < 45 segundos | Tracking UX             |
| ✅ Tasa de completitud          | > 90%         | Analítica de eventos    |
| ⚠️ Tasa de error de validación | < 5%          | Logs de errores         |
| 💬 NPS (feature)               | > +40         | Encuesta post-uso       |
| 🔒 Incidentes GDPR             | 0             | Auditorías trimestrales |

---

## 9. Wireframes Conceptuales

### Pantalla 1: Formulario “Nuevo Candidato”

* Campos obligatorios (7):

  1. Nombre completo
  2. Email
  3. Teléfono
  4. Puesto actual
  5. Localización
  6. Fuente de candidatura
  7. CV (opcional)
* Botones: **Guardar**, **Cancelar**
* Estados:

  * 🟢 *Success:* Mensaje toast “Candidato añadido correctamente”
  * 🔴 *Error:* Mensajes junto a cada campo con texto específico
  * 🕓 *Loading:* Spinner sobre el botón “Guardar”

### Pantalla 2: Alerta Duplicado

* Modal con texto: “Ya existe un candidato con este email”
* Botones: “Ver perfil existente” / “Cancelar”

---

## 10. Matriz de Decisiones

| Opción                | Criterios                | Seleccionada | Justificación                               |
| --------------------- | ------------------------ | ------------ | ------------------------------------------- |
| Formato permitido CV  | PDF, DOCX, TXT           | ✅ PDF/DOCX   | TXT eliminado por inconsistencia de parsing |
| Validación Email      | Regex RFC 5322           | ✅ Sí         | Garantiza compatibilidad internacional      |
| Upload máximo         | 10MB / 5MB               | ✅ 5MB        | Balance entre performance y flexibilidad    |
| Persistencia temporal | LocalStorage / IndexedDB | ✅ IndexedDB  | Soporta mayor volumen y seguridad           |
| Frontend Stack        | React / Angular          | ✅ React      | Ya usado en otros módulos del sistema       |

---

## 📘 Conclusión

La feature “Añadir Candidato al Sistema” constituye el **núcleo operativo del ATS**, optimizando el proceso de alta y reduciendo fricciones para reclutadores.
Se ha priorizado la **seguridad, accesibilidad y rendimiento**, con una arquitectura escalable y alineada con estándares internacionales.
