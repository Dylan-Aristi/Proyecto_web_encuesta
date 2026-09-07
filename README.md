# Encuesta de Satisfacción PAE - IE MJM

Las funciones de tu aplicación con estas nuevas mejoras quedan organizadas de la siguiente manera:

*   **Pantalla de Bienvenida Institucional**: Cuenta con el logotipo oficial de la institución adaptado en un contenedor rectangular con bordes redondeados y fondo blanco para mantener su proporción y estética original.
*   **Navegación Interactiva por Días de la Semana**: Permite seleccionar de forma rápida entre los días hábiles de la semana (Lunes a Viernes).
*   **Control de Asistencia del Estudiante**: Incluye una pantalla inicial para verificar si el estudiante asistió o no asistió al comedor o a la jornada escolar.
    *   **Si asistió**: Redirige al flujo habitual para elegir el tipo de comida (PAE Refrigerio o PAE Almuerzo) y realizar la encuesta de satisfacción.
    *   **Si no asistió**: Redirige a un formulario alternativo de inasistencia para capturar el nombre del estudiante, su grado y el motivo de la inasistencia.
*   **Sistema de Calificación por Estrellas Dinámicas**: Incorpora un panel interactivo de 5 estrellas que se iluminan progresivamente al seleccionarlas y muestran un texto descriptivo de la puntuación obtenida.
*   **Campo de Recomendaciones y Motivos Abiertos**: Ofrece espacios de texto libre tanto en la encuesta de satisfacción como en el reporte de inasistencia para detallar comentarios u observaciones.
*   **Envío Automatizado de Datos (Correo y Google Sheets)**: Procesa y despacha en tiempo real mediante AJAX los resultados de la encuesta o los datos del reporte de inasistencia hacia la dirección de correo configurada y a una hoja de cálculo en tiempo real.
*   **Diseño Responsivo y Control de Scroll**: Posee una interfaz moderna optimizada para diferentes tamaños de pantalla, transiciones fluidas entre vistas y restricciones de desbordamiento web, incluyendo además un sistema de notificaciones modales integradas.
