"""
Script opcional de datos de ejemplo (seed) para pruebas en clase.

Ejecutar dentro del contenedor del backend, una vez que la API ya
haya creado las tablas:

    docker compose exec backend python seed.py
"""
from app.database import SessionLocal
from app import models
from datetime import datetime, timedelta

db = SessionLocal()

if db.query(models.Usuario).count() == 0:
    usuarios = [
        models.Usuario(nombre="Edicson Pineda", email="admin@ucundinamarca.edu.co", rol=models.RolUsuario.admin),
        models.Usuario(nombre="Laura Gómez", email="laura.gomez@ucundinamarca.edu.co", rol=models.RolUsuario.tecnico),
        models.Usuario(nombre="Camilo Rojas", email="camilo.rojas@ucundinamarca.edu.co", rol=models.RolUsuario.tecnico),
        models.Usuario(nombre="Diana Sánchez", email="diana.sanchez@ucundinamarca.edu.co", rol=models.RolUsuario.solicitante),
    ]
    db.add_all(usuarios)

if db.query(models.Equipo).count() == 0:
    equipos = [
        models.Equipo(nombre="Computador Sala 301", tipo="Computador", marca="HP", modelo="ProDesk 400",
                      numero_serie="HP-301-001", ubicacion="Sala de sistemas 301"),
        models.Equipo(nombre="Impresora Secretaría", tipo="Impresora", marca="Epson", modelo="L3250",
                      numero_serie="EP-SEC-002", ubicacion="Secretaría académica"),
        models.Equipo(nombre="Router Bloque B", tipo="Red", marca="TP-Link", modelo="AX3000",
                      numero_serie="TPL-B-003", ubicacion="Bloque B, piso 2"),
    ]
    db.add_all(equipos)

if db.query(models.Repuesto).count() == 0:
    repuestos = [
        models.Repuesto(nombre="Fuente de poder 500W", descripcion="Fuente ATX genérica", stock=10, costo_unitario=120000),
        models.Repuesto(nombre="Cartucho de tinta negro", descripcion="Compatible Epson L3250", stock=15, costo_unitario=45000),
        models.Repuesto(nombre="Memoria RAM 8GB DDR4", descripcion="Kingston 2666MHz", stock=8, costo_unitario=150000),
    ]
    db.add_all(repuestos)
    db.commit() # Hacer commit intermedio para asegurar IDs

if db.query(models.Ticket).count() == 0:
    base_date = datetime.utcnow()
    tickets = [
        # ABIERTOS (3)
        # Equipo 1 (2 abiertos)
        models.Ticket(titulo="Falla 1 - Equipo 1", descripcion="No enciende", estado=models.EstadoTicket.abierto, prioridad=models.PrioridadTicket.alta, equipo_id=1, solicitante_id=4, fecha_creacion=base_date - timedelta(days=5)),
        models.Ticket(titulo="Falla 2 - Equipo 1", descripcion="Pantalla azul", estado=models.EstadoTicket.abierto, prioridad=models.PrioridadTicket.media, equipo_id=1, solicitante_id=4, fecha_creacion=base_date - timedelta(days=4)),
        # Equipo 3 (1 abierto)
        models.Ticket(titulo="Falla 3 - Equipo 3", descripcion="Sin conexión", estado=models.EstadoTicket.abierto, prioridad=models.PrioridadTicket.baja, equipo_id=3, solicitante_id=4, fecha_creacion=base_date - timedelta(days=2)),
        
        # CERRADOS (6)
        # Equipo 1 (3 cerrados)
        models.Ticket(titulo="Falla 4 - Equipo 1", descripcion="Lentitud", estado=models.EstadoTicket.cerrado, prioridad=models.PrioridadTicket.media, equipo_id=1, solicitante_id=4, tecnico_id=2, fecha_creacion=base_date - timedelta(days=10), fecha_cierre=base_date - timedelta(days=9)), # 24h
        models.Ticket(titulo="Falla 5 - Equipo 1", descripcion="Virus", estado=models.EstadoTicket.cerrado, prioridad=models.PrioridadTicket.alta, equipo_id=1, solicitante_id=4, tecnico_id=3, fecha_creacion=base_date - timedelta(days=12), fecha_cierre=base_date - timedelta(days=10)), # 48h
        models.Ticket(titulo="Falla 6 - Equipo 1", descripcion="Teclado roto", estado=models.EstadoTicket.cerrado, prioridad=models.PrioridadTicket.baja, equipo_id=1, solicitante_id=4, tecnico_id=2, fecha_creacion=base_date - timedelta(days=15), fecha_cierre=base_date - timedelta(days=12)), # 72h
        
        # Equipo 2 (3 cerrados)
        models.Ticket(titulo="Falla 7 - Equipo 2", descripcion="Atasco de papel", estado=models.EstadoTicket.cerrado, prioridad=models.PrioridadTicket.alta, equipo_id=2, solicitante_id=4, tecnico_id=2, fecha_creacion=base_date - timedelta(days=8), fecha_cierre=base_date - timedelta(days=7)), # 24h
        models.Ticket(titulo="Falla 8 - Equipo 2", descripcion="Manchas al imprimir", estado=models.EstadoTicket.cerrado, prioridad=models.PrioridadTicket.media, equipo_id=2, solicitante_id=4, tecnico_id=3, fecha_creacion=base_date - timedelta(days=6), fecha_cierre=base_date - timedelta(days=4)), # 48h
        models.Ticket(titulo="Falla 9 - Equipo 2", descripcion="No detecta red", estado=models.EstadoTicket.cerrado, prioridad=models.PrioridadTicket.alta, equipo_id=2, solicitante_id=4, tecnico_id=2, fecha_creacion=base_date - timedelta(days=4), fecha_cierre=base_date - timedelta(days=2, hours=12)), # 36h
    ]
    db.add_all(tickets)
    db.commit()

if db.query(models.Diagnostico).count() == 0:
    base_date = datetime.utcnow()
    diagnosticos = [
        models.Diagnostico(ticket_id=4, tecnico_id=2, descripcion="Se cambió fuente de poder.", fecha=base_date - timedelta(days=9, hours=2)),
        models.Diagnostico(ticket_id=7, tecnico_id=2, descripcion="Se reemplazó cartucho.", fecha=base_date - timedelta(days=7, hours=5))
    ]
    db.add_all(diagnosticos)
    db.commit()

if db.query(models.DiagnosticoRepuesto).count() == 0:
    dr = [
        models.DiagnosticoRepuesto(diagnostico_id=1, repuesto_id=1, cantidad=1), # Fuente de poder 120k
        models.DiagnosticoRepuesto(diagnostico_id=2, repuesto_id=2, cantidad=2)  # 2 Cartuchos tinta 45k c/u (90k)
    ]
    db.add_all(dr)
    db.commit()

db.close()
print("Datos de ejemplo insertados correctamente.")
