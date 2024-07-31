import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    return res.status(401).json({ error: "No autorizado" });
  }

  const token = bearer.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof decoded === "object" && decoded.id) {
      const userExists = await User.findById(decoded.id).select("_id name email");
      if (!userExists) {
        return res.status(404).json({ error: "Token No Válido" });
      }

      req.user = userExists;
    }
  } catch (error) {
    return res.status(500).json({ error: "Token no válido" });
  }

  next();
};
