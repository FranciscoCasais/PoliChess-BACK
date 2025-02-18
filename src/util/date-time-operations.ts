export function esAntes(fecha1: Date, fecha2: Date): boolean {
  return fecha1.getFullYear() < fecha2.getFullYear() ||
    (fecha1.getFullYear() === fecha2.getFullYear() && fecha1.getMonth() < fecha2.getMonth()) ||
    (fecha1.getFullYear() === fecha2.getFullYear() && fecha1.getMonth() === fecha2.getMonth() && fecha1.getDate() < fecha2.getDate());
}

export function esIgual(fecha1: Date, fecha2: Date): boolean {
  return (fecha1.getFullYear() === fecha2.getFullYear() && fecha1.getMonth() === fecha2.getMonth() && fecha1.getDate() === fecha2.getDate());
}

export function esDespues(fecha1: Date, fecha2: Date): boolean {
  return (fecha1.getFullYear() > fecha2.getFullYear() ||
  (fecha1.getFullYear() === fecha2.getFullYear() && fecha1.getMonth() > fecha2.getMonth()) ||
  (fecha1.getFullYear() === fecha2.getFullYear() && fecha1.getMonth() === fecha2.getMonth() && fecha1.getDate() > fecha2.getDate()));
}

export function sumarDias(fecha: Date, dias: number): Date {
  const nuevaFecha = new Date(fecha);
  nuevaFecha.setDate(nuevaFecha.getDate() + dias);

  return nuevaFecha;
}

export function sumarHoras(hora1: string, hora2: string): string {
  const [h1, m1, s1]: number[] = hora1.split(':').map(Number);
  const [h2, m2, s2]: number[] = hora2.split(':').map(Number);

  let segundos: number = s1 + s2;
  let minutos: number = m1 + m2 + Math.floor(segundos / 60);
  let horas: number = h1 + h2 + Math.floor(minutos / 60);

  segundos %= 60;
  minutos %= 60;
  horas %= 24;

  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}

export function obtenerHora(date: Date): string {
  const horas = date.getHours().toString().padStart(2, '0');
  const minutos = date.getMinutes().toString().padStart(2, '0');
  const segundos = date.getSeconds().toString().padStart(2, '0');
  
  return `${horas}:${minutos}:${segundos}`;
}

export function validarFormatoHora(cadena: string): boolean {
  const regex = /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;

  if (!regex.test(cadena)) {
    return false;
  }

  const minutos = parseInt(cadena.split(":")[1]);

  if (minutos % 5 !== 0) {
    return false;
  }

  const segundos = parseInt(cadena.split(":")[2]);

  if (segundos !== 0) {
    return false;
  }

  return true;
}

export function horarioEnRangoValido(horario: string, horarioMinimo: string, horarioMaximo: string): boolean {
  const tiempoAMinutos = (tiempo: string): number => {
    const [horas, minutos] = tiempo.split(':').map(Number);
    return horas * 60 + minutos;
  };

  const tiempoEnMinutos = tiempoAMinutos(horario);
  const horarioMinimoEnMinutos = tiempoAMinutos(horarioMinimo);
  const horarioMaximoEnMinutos = tiempoAMinutos(horarioMaximo);

  return horarioMinimoEnMinutos <= tiempoEnMinutos && tiempoEnMinutos <= horarioMaximoEnMinutos;
}
