# Nueva feature

## Descripción

Añadir Candidato al Sistema
**Como** reclutador,
**Quiero** tener la capacidad de añadir nuevos candidatos al sistema ATS,
**Para** poder gestionar sus datos y procesos de selección de manera eficiente.

## Criterios de Aceptación

1. Acceso a la función:
Debe existir un botón o enlace claramente visible en el dashboard principal del reclutador que permita añadir un nuevo candidato.

2. Formulario de registro:
    Al seleccionar la opción de añadir candidato, se mostrará un formulario con los siguientes campos obligatorios:

    - Nombre
    - Apellido
    - Correo electrónico
    - Teléfono
    - Dirección
    - Educación
    - Experiencia laboral

3. Validación de datos:
    El formulario debe validar la información antes de enviarla.

    - El correo electrónico debe tener un formato válido.
    - Los campos obligatorios no deben quedar vacíos.

4. Carga de documentos:
    El reclutador podrá cargar el CV del candidato en formato PDF o DOCX.

5. Confirmación de registro:
    Tras enviar el formulario correctamente, el sistema mostrará un mensaje de confirmación indicando que el candidato fue añadido exitosamente.

6. Manejo de errores:
    En caso de error (por ejemplo, un fallo de conexión con el servidor), el sistema debe mostrar un mensaje informativo y claro para el usuario.

7. Compatibilidad y accesibilidad:
    La funcionalidad debe ser usable desde distintos dispositivos y navegadores, cumpliendo con buenas prácticas de accesibilidad.

## Notas de Diseño

- La interfaz debe ser intuitiva y fácil de usar, reduciendo la curva de aprendizaje para nuevos reclutadores.
- Se recomienda integrar autocompletado para los campos de educación y experiencia laboral, aprovechando datos preexistentes en el sistema.

## Tareas Técnicas

- Implementar la interfaz de usuario para el formulario de registro de candidatos.
- Desarrollar el backend encargado de procesar y almacenar la información del formulario.
- Garantizar la seguridad y privacidad de los datos personales de los candidatos.
