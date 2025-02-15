export function sumarHorarios(hora1: string, hora2: string): string | null {
  const regex = /^(?:[01]\d|2[0-3]):([0-5]\d)$/;

  if (!regex.test(hora1) || !regex.test(hora2)) {
    return null;
  }

  const [hora1H, hora1M] = hora1.split(':').map(Number);
  const [hora2H, hora2M] = hora2.split(':').map(Number);

  let totalMinutos = (hora1H * 60 + hora1M) + (hora2H * 60 + hora2M);
  totalMinutos = totalMinutos % (24 * 60);

  const nuevaHora = String(Math.floor(totalMinutos / 60)).padStart(2, '0');
  const nuevosMinutos = String(totalMinutos % 60).padStart(2, '0');

  return `${nuevaHora}:${nuevosMinutos}`;
}
