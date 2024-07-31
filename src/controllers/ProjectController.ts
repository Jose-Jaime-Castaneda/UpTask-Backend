import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const newProject = new Project(req.body);

    newProject.manager = req.user.id;

    try {
      await newProject.save();
      res.send("Proyecto creado correctamente");
    } catch (error) {
      console.log(error);
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({
        $or: [
          { manager: { $in: req.user.id } },
          { team: { $in: req.user.id } },
        ],
      });
      res.json(projects);
    } catch (error) {
      console.log(error);
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    const { projectID } = req.params;
    try {
      const project = await Project.findById(projectID).populate("tasks");
      if (!project) {
        return res.status(404).json({ error: "Proyecto no encontrado" });
      }

      if (
        project.manager.toString() !== req.user.id.toString() &&
        !project.team.includes(req.user.id)
      ) {
        return res.status(404).json({ error: "Acceso denegado" });
      }

      res.json(project);
    } catch (error) {
      return res.status(404).json({ error: "Valió quesadilla" });
    }
  };

  static updateProyect = async (req: Request, res: Response) => {
    try {

      req.project.projectName = req.body.projectName;
      req.project.clientName = req.body.clientName;
      req.project.description = req.body.description;

      await req.project.save();
      res.json("Proyecto actualizado");
    } catch (error) {
      console.log(error);
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    try {
      await req.project.deleteOne()
      res.json("Proyecto Eliminado");
    } catch (error) {
      console.log(error);
    }
  };
}
