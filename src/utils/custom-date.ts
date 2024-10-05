export function formatearFechaHora(fecha: string, hora: string): string {
    const [dia, mes, año] = fecha.split('-').map(Number);
    const [horas, minutos] = hora.split(':').map(Number);
  
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
  
    const fechaObjeto = new Date(año, mes - 1, dia, horas, minutos);
  
    const opcionesHora: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
  
    const horaFormateada = new Intl.DateTimeFormat('es-ES', opcionesHora).format(fechaObjeto);
  
    return `${dia} ${meses[mes - 1]} ${horaFormateada}`;
  }