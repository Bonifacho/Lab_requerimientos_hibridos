# Sistema de Gestión de Mantenimiento de Equipos (Helpdesk Técnico)

**Universidad de Cundinamarca** — Facultad de Ingeniería
Asignatura: **Desarrollo de Software para Sistemas Híbridos**
Docente: **Edicson Pineda Cadena**

Aplicación completa (backend FastAPI + PostgreSQL + Docker, frontend
Ionic con React) desarrollada como proyecto integrador de tres sesiones
de laboratorio (9 horas totales).

## Arranque rápido

```bash
# 1) Backend + base de datos
docker compose up --build
docker compose exec backend python seed.py   # datos de ejemplo (opcional)

# 2) Frontend (en otra terminal)
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

- API: http://localhost:8000 (docs interactivas en /docs)
- App: http://localhost:5173

## Modelo de datos (6 entidades)

1. **Usuario** — solicitantes, técnicos y administradores
2. **Equipo** — activos institucionales sujetos a mantenimiento
3. **Ticket** — solicitud de mantenimiento sobre un equipo
4. **Diagnóstico** — informe técnico asociado a un ticket
5. **Repuesto** — inventario de repuestos disponibles
6. **DiagnosticoRepuesto** — detalle de repuestos usados en un diagnóstico

## Requerimientos del proyecto

### Desarrollados por el docente (código funcional incluido)

| # | Requerimiento |
|---|---|
| 1 | CRUD de Equipos |
| 2 | Creación y consulta de Tickets |
| 3 | Asignación de técnico y cambio de estado del Ticket |
| 4 | Registro de Diagnóstico técnico con repuestos utilizados |

### Propuestos para que los estudiantes los completen

| # | Requerimiento |
|---|---|
| 5 | Reportes y estadísticas (dashboard) |
| 6 | Notificaciones de cambio de estado |
| 7 | Historial / auditoría de cambios de estado del ticket |
| 8 | Búsqueda avanzada, filtros y exportación |

Cada uno tiene una página dedicada en el frontend (menú "Por completar")
con la descripción del requerimiento y pistas técnicas, y puntos `TODO`
señalados directamente en el código del backend (`tickets.py`,
`diagnosticos.py`).

## Documentación del proyecto

Ver la carpeta `docs/` (o los PDF entregados junto con este código) para:
- Documentación de avance por sesión
- Manual de usuario
- Manual técnico

## Estructura del repositorio

```
proyecto_helpdesk/
├── docker-compose.yml
├── backend/     (FastAPI + SQLAlchemy + PostgreSQL)
└── frontend/    (Ionic + React + TypeScript + Vite)
```
