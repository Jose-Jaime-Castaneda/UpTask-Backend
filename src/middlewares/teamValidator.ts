import { body, param } from "express-validator";

export const teamtValidations = {
  // Validación de datos para buscar un miembro del equipo
  memberValidator: [
    body("email").isEmail().toLowerCase().withMessage("Email no válido"),
  ],
  // Validación de ID de usuario
  memberIdValidator: [body("id").isMongoId().withMessage("ID no válido")],
  // Validación de ID de usuario en url
  memberIdURLValidator: [param("userId").isMongoId().withMessage("ID no válido")],
};
