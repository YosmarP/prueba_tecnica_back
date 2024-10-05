### Variables de Entorno

Este proyecto utiliza un archivo `.env` para la configuración de la base de datos y el puerto del servidor. **Nota:** Aunque normalmente no se debe subir el archivo `.env` al repositorio por razones de seguridad, en esta prueba técnica se ha subido para facilitar la revisión del proyecto. 

**Importante:** En un proyecto real, las variables de entorno no se suben al control de versiones y se incluyen en el archivo `.gitignore` para evitar la exposición de datos sensibles.

## Resumen de la Aplicación Backend

### Estructura de la Aplicación
La aplicación está construida utilizando **Node.js** y **MongoDB**. Se organiza en **controladores**, **modelos** y **rutas**, asegurando una clara separación de responsabilidades y facilitando el mantenimiento.

### Controladores
- **newsController**: Maneja la lógica de negocio relacionada con las noticias. Incluye métodos para obtener, agregar, archivar y eliminar noticias, así como para manejar errores en las operaciones.

### Modelos
- **News Model**: Define la estructura de los documentos de noticias en la base de datos, incluyendo campos como `title`, `description`, `content`, `author`, y `archiveDate`.

### Rutas
Se implementaron **rutas RESTful** para la gestión de noticias, permitiendo interacciones claras y directas a través de endpoints bien definidos.
Documentación de la API con el **Swagge**r. Solo se probo con la ruta /api/news. http://localhost:3000/api-docs/

### Middleware
- **validateObjectId**: Este middleware se utiliza para validar el formato de los IDs de MongoDB. Verifica si el ID proporcionado en la ruta es un `ObjectId` válido antes de proceder con la lógica del controlador. Si el ID no es válido, devuelve un error 400 al cliente.

### Pruebas Unitarias
Se realizaron pruebas unitarias utilizando **Jest** y **Supertest** para asegurar la calidad y funcionalidad del código. Las pruebas incluyen:

#### Verificación de la Lógica de Negocio
- **Obtener todas las noticias no archivadas**: Verifica que se obtienen correctamente las noticias.
- **Agregar una nueva noticia**: Asegura que se puede agregar una noticia y se devuelve la respuesta adecuada.
- **Archivar una noticia**: Confirma que se archiva correctamente la noticia y se define la fecha de archivo.
- **Eliminar una noticia archivada**: Verifica que se elimina correctamente la noticia.

#### Manejo de Errores
- **Error al obtener noticias**: Simula un error en la base de datos y verifica que se maneja adecuadamente.
- **Error al archivar una noticia que no existe**: Asegura que se devuelve un error adecuado si la noticia no se encuentra.
- **Error al intentar eliminar una noticia que no existe**: Confirma que se devuelve el mensaje correcto para una noticia no encontrada.
- **Error al agregar una noticia con un campo requerido faltante**: Verifica que se maneje el error al intentar agregar una noticia incompleta.

### Uso de `mongodb-memory-server`
Para las pruebas, se utilizó **mongodb-memory-server** para crear una instancia de MongoDB en memoria. Esto permite realizar pruebas sin la necesidad de un servidor de base de datos real, asegurando que las pruebas sean rápidas y aisladas, y que no afecten la base de datos de producción. La configuración y el manejo de la conexión se gestionaron en las pruebas, permitiendo un entorno limpio para cada conjunto de pruebas.

### Cobertura de Pruebas
Se logró una cobertura de pruebas del **89.36%**, garantizando que la mayoría del código está siendo probado.

### Carga Progresiva de Noticias
Se implementó una lógica de **paginación** para la carga progresiva de noticias nuevas y archivadas, permitiendo a los usuarios obtener datos de manera eficiente y evitando la sobrecarga de información. La API permite especificar el número de noticias a cargar por página y el número de página.

### Carga de datos
Utilización de scrpts para la carga inicial de datos

### Optimización y Mejores Prácticas
Se siguieron las **mejores prácticas** en la escritura de código, incluyendo la modularidad y el uso de **linters (ESLint)** para asegurar la calidad del código. Se implementaron pruebas automatizadas para validar la funcionalidad y el rendimiento de la aplicación.

### Comandos
# Ejecutar el proyecto
node src/app.js

# Reiniciar automáticamente cuando se hagan cambios
npx nodemon src/app.js

# Correr los test 
npm test
npx jest
npm test -- <nombre-del-archivo>

# Ejecutar ESLint
npm run lint

# Corrige automáticamente los problemas detectados por ESLint
npx eslint . --fix