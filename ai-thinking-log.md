# AI THINKING LOG

Este documento debe reflejar tu proceso de pensamiento, análisis y aprendizaje sobre cómo trabajas con inteligencia artificial dentro de un entorno de desarrollo profesional.

- El objetivo no es evaluar el código, sino cómo piensas como Senior Developer asistido por IA: tus decisiones, estrategias, sesgos, aprendizajes y evolución desde las sesiones anteriores.

- ## Contenido esperado del archivo ai-thinking-log.md

Estructura sugerida (puedes adaptarla, pero debe contener estos puntos):

1. Tu enfoque de trabajo con IA
      - **Explica brevemente cómo abordas un proyecto desde cero cuando cuentas con un asistente de código.**
      En mi caso siempre empiezo por la generación de un readme.md inicial. No tiene mérito porque se lo vi a Álvaro en un Workshop, pero desde entonces, lo utilizo SIEMPRE. Es ideal para adquirir contexto, para el humano y para la IA. Además, tengo una guía de buenas prácticas de desarrollo que aún estoy tratando de adaptar. A veces la uso como contexto para la generación del código.
      - **¿Cómo decides qué tareas dejar a la IA y cuáles asumir tú directamente?**
      De momento, estoy dejando todo a la IA con mi posterior supervisión. Quiero ver donde encaja y donde no. Mis conclusiones preliminares son que le cuesta refinamiento final y los tests, que no logro que los haga como quiero.
      - **¿Cómo defines el nivel de detalle del prompt?**
      Si la pregunta se refiere a mis prompts, cada vez los hago más directos. Eso no quiere decir cortos, pero ahorro frases que sobreexplican (por ejemplo).
2. ¿Qué aprendiste sobre el equilibrio entre delegar y razonar? Aplicación práctica de lo aprendido en sesiones pasadas. Reflexiona sobre los conceptos vistos anteriormente (prompts efectivos, refinamiento, roles, iteraciones, testing, etc.)
   - **¿Qué técnicas aplicaste?**
     Principalmente, metaprompting. Generé un plan inicial con un metaprompting. De ese plan, generé un cómo llevar a cabo el plan y por último lo ejecuté. Lo dejo al final de este documento.
   - **¿Qué cambió en tu forma de escribir prompts o estructurar el proyecto?**
     Todo. Es la primera vez que hago todo desde la especificación original sin escribir una sola línea de código.
   - **¿Qué hábitos mantuviste o mejoraste?**
     Pues que ahora en lugar de revisar los ficheros del commit, además te exige revisar toda la generación y leer la salida del prompt. Creo que es un trabaja que exige más concentración que antes y que puede cansar.
3. Tu colaboración con la IA durante este ejercicio. Describe cómo fue la interacción:
      - **¿Qué funcionó bien o te sorprendió?**
        La generación del plan y su uso INDEPENDIENTE. Generar los documentos específicos de cada una de las tareas y tratarlos de manera independiente en chats nuevos.
      - **¿En qué momento la IA no entendió el contexto?**
        El hecho de hacer tareas separadas hizo que luego tuviera que unirlas. Para ello, requerí tests e2e con playwright para que rellenase los "huecos" que había dejado en el front. Esto fue más costoso de lo que esperaba.
      - **¿Qué ajustes hiciste para lograr mejores resultados?**
        Tuve que iterar para los tests porque no funcionaban. Además, modifiqué la estructura de carpetas del back (a Arquitectura hexagonal y vertical slice), ya que tuve problemas con docker (no me descargaba la imagen de postgre porque cloudflarestorage estaba bloqueado) y quise explicitar una arquitectura hexagonal para utilizar repositorios en memoria.
4. Decisiones técnicas y de diseño
      - **Explica brevemente las principales decisiones que tomaste en backend, frontend y base de datos.**
       Tomé la decisión de delegarlo en IA 😄. Tan solo la iteración del back que ya he comentado. Y trabajar mucho los tests (con prompts, claro).
      - **Indica qué herramientas o frameworks seleccionaste y por qué.**
        Dado que no tengo demasiada experiencia en node.js, he dejado decidir a la IA. No obstante, en el back no ha incluido nada adicional, pero en el front alguna más, como zod.
      - **Menciona cualquier decisión arquitectónica relevante (estructuras, dependencias, convenciones, etc.).**
        El refactor de Arquitectura hexagonal y vertical slice.

5. Aprendizajes y próximos pasos. Cierra con una reflexión personal:
      - **¿Qué descubriste sobre ti y tu forma de trabajar con IA?**
        Necesito una colección de prompts o generadores de prompts para no empezar siempre desde 0.
      - **¿Qué te gustaría mejorar para el siguiente ejercicio o proyecto?**
        Tener esa colección de prompts que mencionaba antes.

--

He pensado mucho en lo que siempre se repite de que la IA debe ayudar en todas las fases del desarrollo. En este ejercicio estoy un poco "encorsetado" porque las tareas están dividas por rol o tecnología. Yo siempre digo que lo que importa el dominio, por lo que un developer, aunque tenga sus fortalezas y debilidades, debe ser capaz de desarrollar todo lo que requiera el dominio. En este ejercicio, debo separar las tareas por tecnología, por lo que quedan claros los 3 perfiles que se requieren en cada una de ellas. Mi idea era la de usar la IA para entender la solicitud de negocio y dividir las tareas a ejecutar en perfiles de producto owner, arquitectura, base de datos, front y back, las dos últimas utilizando TDD.
Este es el prompt inicial para generar el plan con el modo agente:

```markdown
Eres arquitecto software senior especializado en React y Typescript.

Debes generar un plan para la solicitud que dejo al final. El plan debe consistir en la generación de diferentes perfiles expertos involucrados en el desarrollo de software. Ten en cuenta las buenas prácticas de prompting para la generación de los planes. Deben incluir: 1 - Instrucción, 2 - Estructura lógica, 3 - Claridad y precisión, 4 - Contexto adecuado, 5 - Formato de salida, 6 - Tono, estilo y longitud, 7 - Rol.

Si necesitas incluir detalle de la parte técnica incluye siempre:
"Technical critera:
    - Apply the SOLID principles.
    - Apply clean code.
    - Make it responsive website.

General criteria:
    - Add an attractive and funny title and description.
Los documentos generados déjalos en la carpeta features.

Esta es la solicitud a planificar:

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
```
