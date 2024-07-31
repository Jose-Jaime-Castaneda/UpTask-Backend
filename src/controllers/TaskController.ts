import type { Request, Response } from "express";
import Task from "../models/Task";

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const newTask = new Task(req.body);
      newTask.project = req.project.id;
      req.project.tasks.push(newTask.id);

      await Promise.allSettled([newTask.save(), req.project.save()]);

      res.send("Tarea Creada Correctamente");
    } catch (error) {
      console.log(error);
    }
  };

  static getTasksByProject = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.project }).populate(
        "project"
      );
      res.json({ tasks: tasks });
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getTaskById = async (req: Request, res: Response) => {
    try {
      const task = await Task.findById(req.task.id)
        .populate({ path: "completedBy.user", select: "id name email" })
        .populate({
          path: "notes",
          populate: { path: "createdBy", select: "id name email" },
        });

      res.json({ task });
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updateTask = async (req: Request, res: Response) => {
    try {
      req.task.name = req.body.name;
      req.task.description = req.body.description;

      await req.task.save();
      res.send("Tarea actualizada");
    } catch (error) {
      res.status(500).json({ erros: "Hubo un error al actualizar la tarea" });
    }
  };

  static deleteTaskById = async (req: Request, res: Response) => {
    try {
      req.project.tasks = req.project.tasks.filter(
        (task) => task.toString() !== req.task.id.toString()
      );
      await Promise.allSettled([req.task.deleteOne(), req.project.save()]);

      res.send("Tarea Eliminada");
    } catch (error) {
      res.status(500).json({ erros: "Hubo un error al actualizar la tarea" });
    }
  };

  static updateStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      req.task.status = status;

      const data = {
        user: req.user.id,
        status,
      };

      req.task.completedBy.push(data);

      await req.task.save();

      res.send("Estado Actualizado");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al actualizar la tarea" });
    }
  };
}
