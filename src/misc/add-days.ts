export function sumarDias(fecha: Date, dias: number): Date {
  const nuevaFecha: Date = new Date(fecha);
  nuevaFecha.setDate(nuevaFecha.getDate() + dias);
  return nuevaFecha;
}
