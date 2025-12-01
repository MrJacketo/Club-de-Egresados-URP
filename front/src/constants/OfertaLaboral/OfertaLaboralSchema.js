
import { z } from "zod";
import { REQUISITOS } from "./OfertaLaboral.enum";

export const ofertaLaboralSchema = z.object({
  cargo: z.string().nonempty("El cargo es obligatorio"),
  empresa: z.string().nonempty("La empresa es obligatoria"),
  modalidad: z.string().nonempty("La modalidad es obligatoria"),
  ubicacion: z.string().nonempty("La ubicación es obligatoria"),
  tipoContrato: z.string().nonempty("El tipo de contrato es obligatorio"),
  descripcion: z.string().nonempty("La descripción es obligatoria"),
  requisitos: z.enum(REQUISITOS, {
    errorMap: () => ({ message: "Selecciona un nivel de experiencia válido" })
  }).optional().or(z.literal("")),
  area: z.string().optional(),
  linkEmpresa: z.string().url("Debe ser un enlace válido"),
  salario: z.coerce.number().min(0, "El salario no puede ser negativo"),
  fechaCierre: z
    .string()
    .nonempty("La fecha de cierre es obligatoria")
    .refine((val) => {
      const fechaCierre = new Date(val);
      const fechaActual = new Date();
      return fechaCierre >= fechaActual;
    }, {
      message: "La fecha de cierre no puede ser anterior a hoy",
    }),
});