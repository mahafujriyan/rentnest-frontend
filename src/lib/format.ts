export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/** Prefer moveInDate from backend; fall back to legacy startDate. */
export function formatRentalDate(rental: {
  moveInDate?: string;
  startDate?: string;
  endDate?: string;
}): string {
  const date = rental.moveInDate || rental.startDate;
  if (!date) return "Date TBD";
  if (rental.endDate && rental.startDate && !rental.moveInDate) {
    return `${formatDate(rental.startDate)} – ${formatDate(rental.endDate)}`;
  }
  return `Move-in ${formatDate(date)}`;
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
