import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../utils/email";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      // Evitar duplicados
      const userExists = await User.findOne({ email: req.body.email });
      if (userExists) {
        return res.status(409).json({ error: "Ese correo ya esta registrado" });
      }

      const user = new User(req.body);

      // Hashear contraseña
      user.password = await hashPassword(req.body.password);

      // Generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // Enviar email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await user.save();
      await token.save();

      res.send("Cuenta creada, entra a tu correo y confirmala");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        return res.status(401).json({ error: "Token no válido" });
      }

      const confirmedUser = await User.findById(tokenExists.user);
      if (!confirmedUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      confirmedUser.confirm = true;

      await confirmedUser.save();
      await tokenExists.deleteOne();

      return res.send("Cuenta confirmada correctamanete");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const existUser = await User.findOne({ email });
      if (!existUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      if (!existUser.confirm) {
        const token = new Token();
        token.user = existUser.id;
        token.token = generateToken();

        await token.save();

        AuthEmail.sendConfirmationEmail({
          email: existUser.email,
          name: existUser.name,
          token: token.token,
        });

        return res.status(401).json({
          error:
            "El usuario no ha sido confirmado, hemos enviado un correo de confirmación",
        });
      }

      const isPasswordCorrect = await checkPassword(
        password,
        existUser.password
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({ error: "Las contraseñas no coinciden" });
      }

      const token = generateJWT({ id: existUser.id });

      res.send(token);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      // Evitar duplicados
      const userExists = await User.findOne({ email: req.body.email });
      if (!userExists) {
        return res.status(404).json({ error: "El usuario no existe" });
      }

      if (userExists.confirm) {
        return res.status(403).json({ error: "El usuario ya esta confirmado" });
      }

      // Generar token
      const token = new Token();
      token.token = generateToken();
      token.user = userExists.id;

      // Enviar email
      AuthEmail.sendConfirmationEmail({
        email: userExists.email,
        name: userExists.name,
        token: token.token,
      });

      await userExists.save();
      await token.save();

      res.send("Se envión un nuevo token a tu correo");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      // Evitar duplicados
      const userExists = await User.findOne({ email: req.body.email });
      if (!userExists) {
        return res.status(404).json({ error: "El usuario no existe" });
      }

      // Generar token
      const token = new Token();
      token.token = generateToken();
      token.user = userExists.id;

      await token.save();

      // Enviar email
      AuthEmail.sendPasswordResetToken({
        email: userExists.email,
        name: userExists.name,
        token: token.token,
      });

      res.send("Se envió un nuevo token a tu correo");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        return res.status(404).json({ error: "El token no existe" });
      }

      return res.send("Token Validado");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static newPassword = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;

      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        return res.status(404).json({ error: "Token no válido" });
      }

      const user = await User.findById(tokenExists.user);

      // Hashear contraseña
      user.password = await hashPassword(req.body.password);

      await tokenExists.deleteOne();
      await user.save();

      res.send("Contraseña actualizada");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static user = async (req: Request, res: Response) => {
    return res.json(req.user);
  };

  static updateProfile = async (req: Request, res: Response) => {
    const { name, email } = req.body;

    req.user.name = name;
    req.user.email = email;

    const userExists = await User.findOne({ email });
    if (userExists && userExists.id.toString() !== req.user.id.toString()) {
      return res.status(409).json({ error: "Ese email ya esta registrado" });
    }

    try {
      await req.user.save();
      res.send("Perfil actualizado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updateCurrentPassword = async (req: Request, res: Response) => {
    const { current_password, password } = req.body;

    const userExists = await User.findById(req.user.id);

    const isPasswordCorrect = await checkPassword(
      current_password,
      userExists.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ error: "La contraseña actual no coincide" });
    }

    try {
      userExists.password = await hashPassword(password);
      await userExists.save();
      res.send("Contraseña Actualizada");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static checkPassword = async (req: Request, res: Response) => {
    const { password } = req.body;

    const userExists = await User.findById(req.user.id);

    const isPasswordCorrect = await checkPassword(
      password,
      userExists.password
    );
    
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ error: "La contraseña no coincide" });
    }

    res.send('Contraseña validada')
  };
}
