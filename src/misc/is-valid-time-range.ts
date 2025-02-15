export function horarioEnRangoValido(horario: string, horarioMinimo: string, horarioMaximo: string): boolean {
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const timeInMinutes = timeToMinutes(horario);
  const startInMinutes = timeToMinutes(horarioMinimo);
  const endInMinutes = timeToMinutes(horarioMaximo);

  return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
}
