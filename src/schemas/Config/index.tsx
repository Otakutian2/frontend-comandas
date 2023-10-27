import * as Yup from "yup";

Yup.setLocale({
  mixed: {
    default: "No es válido",
    required: "Este campo es requerido",
    oneOf: "El valor proporcionado no es válido",
  },
  string: {
    email: "Correo electrónico inválido",
    length: "Debe tener exactamente ${length} caracteres",
    min: "Debe tener al menos ${min} caracteres",
    max: "Debe tener como máximo ${max} caracteres",
  },
  number: {
    positive: "Debe ser un número positivo",
    min: "Debe ser como mínimo ${min}",
    max: "Debe ser como máximo ${max}",
    moreThan: "Debe ser mayor a ${more}",
    lessThan: "Debe ser menor a ${less}",
    integer: "Debe ser un número entero",
  },
});

export default Yup;
