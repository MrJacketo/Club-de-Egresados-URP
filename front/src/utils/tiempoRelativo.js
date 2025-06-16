import { DirectionsTransitFilledSharp } from "@mui/icons-material";
import {
  formatDistanceToNow,
  differenceInWeeks,
  differenceInMonths,
  parseISO,
  differenceInHours,
  differenceInDays,
  differenceInMinutes
} from "date-fns";

export function DiasTranscurridos(fecha) {
  const fechaObj = typeof fecha === "string" ? parseISO(fecha) : fecha;
  const ahora = new Date();
  return differenceInDays(ahora, fechaObj);
}

export function tiempoRelativo(fecha) {
  const fechaObj = typeof fecha === "string" ? parseISO(fecha) : fecha;
  const ahora = new Date();

  const diffMonths = differenceInMonths(ahora, fechaObj);
  if (diffMonths >= 1) {
    return diffMonths === 1 ? "hace 1 mes" : `hace ${diffMonths} meses`;
  }

  const diffWeeks = differenceInWeeks(ahora, fechaObj);
  if (diffWeeks >= 1) {
    return diffWeeks === 1 ? "hace 1 semana" : `hace ${diffWeeks} semanas`;
  }

  const diffDays = differenceInDays(ahora, fechaObj);
  if (diffDays >= 1) {
    return diffDays === 1 ? "Ayer" : `hace ${diffDays} días`;
  }

  const diffHours = differenceInHours(ahora, fechaObj);
  if (diffHours >= 1) {
    return diffHours === 1 ? "hace 1 hora" : `hace ${diffHours} horas`;
  }

  const diffMinutes = differenceInMinutes(ahora, fechaObj);
  if (diffMinutes >= 1 | diffMinutes<1 ) {
    return diffMinutes === 1  ? "hace 1 minuto" : `hace ${diffMinutes} minutos`;
  }

  return formatDistanceToNow(fechaObj, { addSuffix: true });
}