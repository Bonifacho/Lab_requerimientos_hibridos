from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/reportes", tags=["Reportes"])


@router.get("/resumen", response_model=schemas.ReporteResumenOut)
def obtener_resumen_reportes(db: Session = Depends(get_db)):
    """
    Retorna estadísticas agregadas del helpdesk.
    """
    # 1. Cantidad de tickets por estado
    estado_counts = db.query(
        models.Ticket.estado, func.count(models.Ticket.id)
    ).group_by(models.Ticket.estado).all()
    tickets_por_estado = {estado.value: count for estado, count in estado_counts}

    # 2. Equipo con más fallas
    equipo_mas_fallas_query = db.query(
        models.Equipo.nombre, func.count(models.Ticket.id).label("total")
    ).join(models.Ticket).group_by(models.Equipo.id).order_by(desc("total")).first()
    
    equipo_mas_fallas = None
    if equipo_mas_fallas_query:
        equipo_mas_fallas = {
            "nombre": equipo_mas_fallas_query.nombre,
            "total_tickets": equipo_mas_fallas_query.total
        }

    # 3. Tiempo promedio de resolución (horas)
    tiempo_promedio = db.query(
        func.avg(models.Ticket.fecha_cierre - models.Ticket.fecha_creacion)
    ).filter(models.Ticket.estado == models.EstadoTicket.cerrado).scalar()
    
    tiempo_promedio_resolucion_horas = None
    if tiempo_promedio:
        tiempo_promedio_resolucion_horas = round(tiempo_promedio.total_seconds() / 3600, 2)

    # 4. Costo total de repuestos usados por mes
    costos_mes = db.query(
        func.extract('month', models.Diagnostico.fecha).label('mes'),
        func.sum(models.DiagnosticoRepuesto.cantidad * models.Repuesto.costo_unitario).label('costo')
    ).join(models.DiagnosticoRepuesto, models.Diagnostico.id == models.DiagnosticoRepuesto.diagnostico_id) \
     .join(models.Repuesto, models.Repuesto.id == models.DiagnosticoRepuesto.repuesto_id) \
     .group_by('mes').all()

    costo_repuestos_por_mes = [
        schemas.CostoPorMes(mes=int(row.mes), costo_total=float(row.costo))
        for row in costos_mes if row.mes is not None and row.costo is not None
    ]

    return schemas.ReporteResumenOut(
        tickets_por_estado=tickets_por_estado,
        equipo_mas_fallas=equipo_mas_fallas,
        tiempo_promedio_resolucion_horas=tiempo_promedio_resolucion_horas,
        costo_repuestos_por_mes=costo_repuestos_por_mes
    )
