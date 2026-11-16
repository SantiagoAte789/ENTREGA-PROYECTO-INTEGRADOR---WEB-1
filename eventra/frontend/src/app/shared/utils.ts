/** Clase Bootstrap para mostrar el estado de eventos y reservas. */
export function badgeClass(estado: string): string {
  switch (estado) {
    case 'Confirmada':
    case 'En Boletería':
    case 'En Vivo':
      return 'text-bg-success';
    case 'Reservada':
    case 'Programado':
      return 'text-bg-primary';
    case 'Cancelada':
    case 'Cancelado':
      return 'text-bg-danger';
    default:
      return 'text-bg-secondary';
  }
}
