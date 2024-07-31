import { body, param } from "express-validator";

export const projectValidations = {
  // Validación de datos para crear un proyecto
  projectValidator: [
    body("projectName")
      .notEmpty()
      .withMessage("En Nombre del Proyecto es obligatorio")
      .isString()
      .withMessage("Nombre de Proyecto no válido"),
    body("clientName")
      .notEmpty()
      .withMessage("El Nombre del Cliente es obligatorio")
      .isString()
      .withMessage("Nombre de Cliente no válido"),
    body("description")
      .notEmpty()
      .withMessage("La Descripción es obligatoria")
      .isString()
      .withMessage("Descripción no válida"),
  ],
  // Validación del ID en la URL
  urlId: [
    param("projectID")
      .isMongoId()
      .withMessage("Formato de ID inválido"),
  ],
};
