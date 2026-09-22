# Frontend — Helpdesk Técnico (Ionic + React + TypeScript)

Universidad de Cundinamarca · Desarrollo de Software para Sistemas Híbridos
Docente: Edicson Pineda Cadena

## Ejecutar en modo desarrollo

Requiere que el backend (FastAPI) ya esté corriendo — ver `../backend/README.md`
o `../docker-compose.yml`.

```bash
cd frontend
npm install
cp .env.example .env.local     # ajustar VITE_API_URL si el backend no está en localhost:8000
npm run dev
```

Se abre en http://localhost:5173

## Compilar para producción

```bash
npm run build
```

## Estructura

```
frontend/
├── src/
│   ├── App.tsx                    # Router y layout (menú lateral)
│   ├── services/api.ts            # Cliente Axios + tipos + funciones por entidad
│   ├── components/
│   │   ├── EncabezadoInstitucional.tsx
│   │   ├── MenuLateral.tsx
│   │   └── PaginaPorCompletar.tsx # Plantilla para los requerimientos de estudiantes
│   ├── pages/
│   │   ├── EquiposPage.tsx        # Requerimiento 1
│   │   ├── TicketsPage.tsx        # Requerimiento 2
│   │   ├── TicketDetallePage.tsx  # Requerimientos 3 y 4
│   │   ├── ReportesPage.tsx       # Requerimiento 5 (por completar)
│   │   ├── NotificacionesPage.tsx # Requerimiento 6 (por completar)
│   │   ├── HistorialPage.tsx      # Requerimiento 7 (por completar)
│   │   └── BusquedaPage.tsx       # Requerimiento 8 (por completar)
│   └── theme/variables.css        # Colores institucionales UCundinamarca
```

## Requerimientos implementados

1. **Equipos** — CRUD completo con baja lógica.
2. **Tickets** — Creación de solicitudes de mantenimiento asociadas a un equipo.
3. **Asignación y estado** — Asignar técnico y controlar la transición de estados del ticket.
4. **Diagnóstico técnico** — Registro de diagnóstico con repuestos utilizados y descuento de inventario.

Las páginas de los requerimientos 5 a 8 están disponibles en el menú
("Por completar — estudiantes") y explican qué deben construir y dónde
conectarlo con el backend.
