export function traducirEntornoNode(entornoNode: string): string {
  switch (entornoNode) {
    case 'development':
      return 'desarrollo';
    case 'production':
      return 'producción';
    case 'test':
      return 'pruebas';
    default:
      return 'desconocido';
  }
}
