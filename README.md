
# Wiki Recetas - API REST (Backend)

## Requisitos

-   Node.js y npm instalados.
    
-   MySQL ejecutándose en el puerto 3306.
    

## Despliegue

1.  Ejecutar el script SQL incluido para generar la base de datos `wiki_recetas_db`.
    
2.  Clonar este proyecto y ejecutar `npm install` en la terminal.

3.  Iniciar el servidor ejecutando `node index.js`.
    
4.  La API estará disponible en `http://localhost:3000/api/`.
    

## Funcionalidades

Se implementó el consumo de la base de datos y un **CRUD completo para 4 tablas** cumpliendo con los requisitos del proyecto:

-   `/api/recetas` (GET, POST, PUT, DELETE)
    
-   `/api/categorias` (GET, POST, PUT, DELETE)
    
-   `/api/ingredientes` (GET, POST, PUT, DELETE)
    
-   `/api/usuarios` (GET, POST, PUT, DELETE)