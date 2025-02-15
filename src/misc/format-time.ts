export function formatoHora(fecha: Date): string {
  const horas: string = fecha.getHours().toString().padStart(2, '0');
  const minutos: string = fecha.getMinutes().toString().padStart(2, '0');
  
  return `${horas}:${minutos}`;
}
