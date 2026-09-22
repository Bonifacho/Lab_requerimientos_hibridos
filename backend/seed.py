"""
Script opcional de datos de ejemplo (seed) para pruebas en clase.

Ejecutar dentro del contenedor del backend, una vez que la API ya
haya creado las tablas:

    docker compose exec backend python seed.py
"""
from app.database import SessionLocal
from app import models

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

db.commit()
db.close()
print("Datos de ejemplo insertados correctamente.")
