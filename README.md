<h1 align="center">Gestor de Tareas - Frontend</h1>

<p align="center"> Proyecto frontend de una aplicación de tareas (TODO list) construido con Next.js, React y TypeScript. <br /> <strong><a href="https://github.com/alfredo-medrano/frontend_pruebatecnica">Explora el código »</a></strong> </p>

<p align="center"> <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"> <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"> <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios"> </p>

📝 Sobre el Proyecto
Este es el frontend para una aplicación full-stack de gestión de tareas. Se conecta a una API de backend en Laravel para manejar la autenticación de usuarios y todas las operaciones de las tareas.

El proyecto está construido siguiendo las mejores prácticas modernas, incluyendo tipado estricto con TypeScript, manejo de estado global con React Context y una interfaz de usuario limpia con Tailwind CSS.

✨ Características Principales
Autenticación JWT: Sistema completo de Registro e Inicio de Sesión.

CRUD de Tareas: Funcionalidad completa para Crear, Leer, Actualizar/page.tsx`] y Borrar tareas.

Rutas Protegidas: Un AuthGuard personalizado protege las rutas que requieren que el usuario esté autenticado.

Manejo de Errores Global: Un interceptor de Axios (lib/axios.ts) maneja centralizadamente los errores de API, como tokens vencidos (401), para desloguear al usuario.

Feedback Visual: Indicadores de carga (<Loader2 />) en todos los formularios y al cargar la sesión, mejorando la experiencia de usuario (UX).

🚀 Puesta en Marcha
Sigue estos pasos para levantar el proyecto en tu entorno local.

Prerrequisitos
Node.js (v18 o superior)

npm (o yarn / pnpm / bun)

El proyecto de backend debe estar instalado y corriendo (disponible en http://127.0.0.1:8000).

🔧 Instalación
Clona el repositorio:

Bash

git clone https://github.com/alfredo-medrano/frontend_pruebatecnica.git
cd frontend_pruebatecnica
Instala las dependencias:

Bash

npm install
Configura las variables de entorno: Crea un archivo llamado .env.local en la raíz del proyecto. Este archivo es crucial para conectar con la API.

Bash

# .env.local
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
(Asegúrate de que la URL coincida con el puerto donde está corriendo tu API de backend)

🏃 Ejecutar la Aplicación
Una vez instalado, puedes correr el servidor de desarrollo local:

Bash

npm run dev
Abre http://localhost:3000 en tu navegador para ver la aplicación en funcionamiento.
