import { Request, Response, NextFunction } from "express";
import { body, param } from "express-validator";

export const authValidations = {
  // Validación para entrada de datos
  authData: [
    body("name")
      .notEmpty()
      .withMessage("El Nombre de usuario es obligatorio")
      .isString()
      .withMessage("El nombre solo puede contener letras"),
    body("password")
      .notEmpty()
      .withMessage("La Contraseña es obligatoria")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener minímo 8 caracteres"),
    body("password_confirm").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Las contraseñas no son iguales");
      }
      return true;
    }),
    body("email")
      .notEmpty()
      .withMessage("El Correo es obligatorio")
      .isEmail()
      .withMessage("Email no válido"),
  ],
  // Validar que se mande un token
  token: [
    body("token")
      .notEmpty()
      .withMessage("El token no puede ir vacío")
      .isString()
      .withMessage("Toke inválido"),
  ],
  // Validar el login
  loginData: [
    body("email")
      .notEmpty()
      .withMessage("El Correo es obligatorio")
      .isEmail()
      .withMessage("Email no válido"),
    body("password").notEmpty().withMessage("La Contraseña es obligatoria"),
  ],
  // Validar petición de nuevo token
  newTokenData: [
    body("email")
      .notEmpty()
      .withMessage("El Correo es obligatorio")
      .isEmail()
      .withMessage("Email no válido"),
  ],
  // Validar que venga un token
  validatetoken: [body("token").isNumeric().withMessage("Token no válido")],
  // Validar que venga una contraseña
  newPassword: [
    body("password")
      .notEmpty()
      .withMessage("La Contraseña es obligatoria")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener minímo 8 caracteres"),
    body("password_confirm").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Las contraseñas no son iguales");
      }
      return true;
    }),
    param("token").isNumeric().withMessage("Token no valido"),
  ],
  // Validar datos para actualizar perfil
  updateProfile: [
    body("name")
      .notEmpty()
      .withMessage("El Nombre de usuario es obligatorio")
      .isString()
      .withMessage("El nombre solo puede contener letras"),
    body("email")
      .notEmpty()
      .withMessage("El Correo es obligatorio")
      .isEmail()
      .withMessage("Email no válido"),
  ],
  // Validar datos para el cambio de contraseña del usuario actual
  updateCurretnUserPassword: [
    body("current_password")
    .notEmpty()
    .withMessage("La Contraseña es obligatoria"),
    body("password")
      .notEmpty()
      .withMessage("La Contraseña es obligatoria")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener minímo 8 caracteres"),
    body("new_password_confirm").custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error("Las contraseñas no son iguales");
      }
      return true;
    }),
  ],
  // Validar que manden una contraseña
  checkPwd: [
    body("password")
    .notEmpty()
    .withMessage("La Contraseña es obligatoria"),
  ]
};
