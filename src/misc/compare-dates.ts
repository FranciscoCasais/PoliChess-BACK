export function EsAntesOIgual(fecha1: Date, fecha2: Date): boolean {
  return fecha1.getFullYear() < fecha2.getFullYear() ||
    (fecha1.getFullYear() === fecha2.getFullYear() && fecha1.getMonth() < fecha2.getMonth()) ||
    (fecha1.getFullYear() === fecha2.getFullYear() && fecha1.getMonth() === fecha2.getMonth() && fecha1.getDate() <= fecha2.getDate());
}
