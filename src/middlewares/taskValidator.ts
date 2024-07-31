import type { Request, Response, NextFunction } from "express";
import { body, param } from "express-validator";
import Project, { IProject } from "../models/Project";
import Task, { ITask } from "../models/Task";

declare global {
  namespace Express {
    interface Request {
      project: IProject;
      task: ITask;
    }
  }
}

export const taskValidations = {
  // Validación para el ID en la URL
  urlID: [
    param("projectID")
      .isMongoId()
      .withMessage("El ID del Proyecto es Inválido"),
  ],
  // Validación de entrada de datos
  taskValidator: [
    body("name").notEmpty().withMessage("El Nombre de la Tarea es obligatorio"),
    body("description")
      .notEmpty()
      .withMessage("La Descripcion de la Tarea es obligatoria"),
  ],
  // Validación para el ID de la tarea en la URL
  taskID: [param("taskID").isMongoId().withMessage("ID de tarea inválido")],
  // Váldación del estado
  taskStatus: [
    body("status")
      .notEmpty()
      .withMessage("El nuevo Estado para la Tarea es Obligatorio")
      .isString()
      .withMessage("El Estado debe ser una cadena de texto"),
  ],
  // Válidación para agregar nota
  taskNote: [
    body("content").notEmpty().withMessage("El contenido es obligatorio"),
  ],
  // Válidación del id de la nota
  noteID: [
    param('noteID').isMongoId().withMessage('ID no Válido')
  ]
};

export const existingProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { projectID } = req.params;

  const project = await Project.findById(projectID);
  if (!project) {
    return res.status(404).json({ error: "Proyecto no encontrado" });
  }
  req.project = project;
  next();
};

export const existingTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { taskID } = req.params;

  const task = await Task.findById(taskID);
  if (!task) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }
  req.task = task;
  next();
};

export const taskBelongToProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.task.project.toString() !== req.project.id.toString()) {
    return res.status(404).json({ error: "La tarea no pertenece al proyecto" });
  }
  next();
};

export const hasAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.id.toString() !== req.project.manager.toString()) {
    return res
      .status(400)
      .json({ error: "El usuario no tiene permisos para esto" });
  }
  next();
};
