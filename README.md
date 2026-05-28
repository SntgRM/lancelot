# Lancelot ToDo

Aplicación fullstack de gestión de tareas personales. Cada usuario autenticado puede crear, editar, eliminar y filtrar sus propias tareas con soporte de prioridades y estados.

- **Frontend:** React 19 + Vite + Tailwind CSS 4
- **Backend:** Django 5.2 + Django REST Framework
- **Base de datos:** MySQL 8
- **Autenticación:** JWT (access + refresh token)
- **Infraestructura:** Docker Compose

---

## Tecnologías

| Tecnología | Justificación |
|---|---|
| Django REST Framework | Construcción rápida de APIs REST con autenticación y permisos integrados |
| SimpleJWT | Manejo estándar de JWT con soporte para refresh token automático |
| React 19 + Vite | Frontend moderno con HMR y build optimizado |
| Tailwind CSS 4 | Estilos utilitarios sin CSS personalizado excesivo |
| MySQL 8 | Persistencia relacional robusta y ampliamente usada en producción |
| Docker Compose | Entorno reproducible y consistente entre máquinas |

---

## Cómo ejecutar el proyecto

### Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/SntgRM/lancelot
cd lancelot
```

### 2. Verificaciones importantes antes de levantar

> **⚠️ El archivo `server/initial_data.json` debe estar guardado en UTF-8.**
>
> En VS Code: abre el archivo → esquina inferior derecha verás la codificación actual → haz clic → selecciona **"Save with Encoding"** → elige **UTF-8**.

> **⚠️ El archivo `server/entrypoint.sh` debe usar saltos de línea LF, no CRLF.**
>
> En VS Code: abre el archivo → esquina inferior derecha verás `CRLF` o `LF` → haz clic → selecciona **LF** → guarda.
>
> Los contenedores corren sobre Linux. CRLF en scripts `.sh` produce errores como `bad interpreter: No such file or directory` y rompe el arranque del backend.

### 3. Levantar los contenedores

```bash
docker compose up --build
```

Este comando:
1. Levanta MySQL y espera a que esté listo
2. Aplica las migraciones (`migrate`)
3. Carga los datos iniciales (`loaddata initial_data.json`)
4. Inicia el servidor Django en el puerto `8000`
5. Inicia el servidor Vite en el puerto `5173`

### 4. Acceder a la aplicación

Una vez que todos los contenedores estén corriendo, **la aplicación se visualiza y se prueba desde el frontend:**

> ### 👉 http://localhost:5173

Ahí encontrarás el login, el dashboard y toda la funcionalidad de la app.

Los otros servicios son de soporte:

| Servicio | URL | Uso |
|---|---|---|
| Backend API | http://localhost:8000/api | Consumido internamente por el frontend |

### Credenciales de prueba

| Usuario | Contraseña |
|---|---|
| `usuario1` | `User123*` |
| `usuario2` | `User123*` |

---

## Autenticación

El flujo de autenticación usa **JWT** mediante `djangorestframework-simplejwt`:

1. El usuario envía `username` y `password` a `POST /api/auth/login/`
2. El backend devuelve un **access token** (válido 1 hora) y un **refresh token** (válido 7 días)
3. El frontend almacena ambos tokens en `localStorage` y adjunta el access token en cada request como `Authorization: Bearer <token>`
4. Cuando el access token expira (respuesta `401`), el interceptor de Axios solicita automáticamente un nuevo access token a `POST /api/auth/token/refresh/` usando el refresh token, sin interrumpir al usuario
5. Si el refresh token también es inválido o no existe, el usuario es redirigido al login
6. Las rutas del frontend están protegidas mediante `ProtectedRoute`, que verifica la existencia del token antes de renderizar

---

## Decisiones técnicas

**Docker Compose** permite que cualquier desarrollador levante el proyecto completo (base de datos, backend y frontend) con un solo comando, eliminando problemas de entorno local y diferencias entre sistemas operativos.

**JWT** fue elegido sobre sesiones tradicionales porque es stateless, compatible con APIs REST y adecuado para arquitecturas desacopladas donde el frontend y el backend son servicios independientes. La rotación automática de refresh tokens añade una capa de seguridad sin afectar la experiencia de usuario.

**React + Django** es una combinación pragmática para una prueba técnica fullstack: Django provee un backend sólido con ORM, autenticación y serialización en pocas líneas; React permite construir una UI reactiva y moderna con un ecosistema bien establecido.
