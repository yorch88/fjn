# Sistema de Tickets (Kiosko) - Frontend

Proyecto base en **React + Vite** con **TailwindCSS** y entorno de desarrollo en **Docker**.
Arquitectura de **monolito modular**, organizada por módulos de dominio.

## Estructura del proyecto

```bash
.
├── docker-compose.yml
├── Makefile
└── frontend
    ├── Dockerfile
    ├── index.html
    ├── package.json
    ├── postcss.config.cjs
    ├── tailwind.config.cjs
    ├── vite.config.mts
    ├── .dockerignore
    └── src
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        └── modules
            ├── tickets
            │   └── components
            │       └── TicketList.jsx
            ├── kanban
            │   └── components
            │       └── KanbanBoard.jsx
            └── andon
                └── components
                    └── AndonBoard.jsx
```

## Requisitos

- Docker
- Docker Compose
- Make

## Uso rápido

### 1. Construir imágenes

```bash
make build
```

### 2. Levantar entorno de desarrollo

```bash
make up
```

Accede a: `http://localhost:5173`

Cualquier cambio en los archivos de `frontend/src` se reflejará inmediatamente gracias a **Vite HMR** sin reiniciar el contenedor.

### 3. Detener contenedores

```bash
make down
```

### 4. Acceder a la consola del contenedor frontend

```bash
make shell-frontend
```

Dentro del contenedor puedes ejecutar comandos como `npm test`, etc.

---

Tailwind funciona en modo **offline**, compilado a través de PostCSS/Tailwind dentro del contenedor (sin CDN).
