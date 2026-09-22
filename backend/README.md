# Backend — Helpdesk Técnico (FastAPI + PostgreSQL + Docker)

Universidad de Cundinamarca · Desarrollo de Software para Sistemas Híbridos
Docente: Edicson Pineda Cadena

## Ejecutar con Docker (recomendado)

Desde la raíz del proyecto (donde está `docker-compose.yml`):

```bash
docker compose up --build
```

- API disponible en: http://localhost:8000
- Documentación interactiva (Swagger): http://localhost:8000/docs
- PostgreSQL disponible en el puerto 5432 (usuario/clave en `.env.example`)

Para cargar datos de ejemplo (usuarios, equipos, repuestos):

```bash
docker compose exec backend python seed.py
```

## Ejecutar sin Docker (alternativa local)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # En Windows: venv\Scripts\activate
pip install -r requirements.txt
export DATABASE_URL="postgresql://helpdesk_user:helpdesk_pass@localhost:5432/helpdesk_db"
uvicorn app.main:app --reload
```

(Requiere una instancia de PostgreSQL disponible en `localhost:5432`.)

## Estructura

```
backend/
├── app/
│   ├── main.py            # Punto de entrada, registro de routers, CORS
│   ├── database.py        # Conexión SQLAlchemy a PostgreSQL
│   ├── models.py          # 6 entidades (Usuario, Equipo, Ticket, Diagnostico, Repuesto, DiagnosticoRepuesto)
│   ├── schemas.py         # Esquemas Pydantic de entrada/salida
│   └── routers/
│       ├── usuarios.py
│       ├── equipos.py       # Requerimiento 1
│       ├── tickets.py       # Requerimientos 2 y 3
│       ├── repuestos.py
│       └── diagnosticos.py  # Requerimiento 4
├── seed.py                 # Datos de ejemplo
├── requirements.txt
└── Dockerfile
```

## Requerimientos pendientes para los estudiantes

Los puntos `TODO` dentro de `tickets.py` y `diagnosticos.py` señalan dónde
se conectan los 4 requerimientos propuestos (reportes/estadísticas,
notificaciones, historial de estados y búsqueda avanzada). Ver el
documento de la Sesión 3 para el detalle de cada uno.
