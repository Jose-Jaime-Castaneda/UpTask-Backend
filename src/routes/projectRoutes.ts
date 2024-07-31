import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { projectValidations } from "../middlewares/projectValidator";
import {
  taskValidations,
  existingProject,
  existingTask,
  taskBelongToProject,
  hasAuthorization,
} from "../middlewares/taskValidator";
import { validationResponse } from "../middlewares/validationResponse";
import { TaskController } from "../controllers/TaskController";
import { authenticate } from "../middlewares/auth";
import { teamtValidations } from "../middlewares/teamValidator";
import { TeamMemberController } from "../controllers/TeamController";
import { body } from "express-validator";
import { NoteController } from "../controllers/NoteController";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  projectValidations.projectValidator,
  validationResponse,
  ProjectController.createProject
);
router.get("/", ProjectController.getAllProjects);
router.get(
  "/:projectID",
  projectValidations.urlId,
  validationResponse,
  ProjectController.getProjectById
);

router.param("projectID", existingProject);

router.put(
  "/:projectID",
  projectValidations.urlId,
  projectValidations.projectValidator,
  validationResponse,
  hasAuthorization,
  ProjectController.updateProyect
);
router.delete(
  "/:projectID",
  projectValidations.urlId,
  validationResponse,
  hasAuthorization,
  ProjectController.deleteProject
);
// Tasks
router.param("projectID", existingProject);
router.param("taskID", existingTask);
router.param("taskID", taskBelongToProject);

router.post(
  "/:projectID/tasks",
  hasAuthorization,
  taskValidations.urlID,
  taskValidations.taskValidator,
  validationResponse,
  TaskController.createTask
);
router.get(
  "/:projectID/tasks",
  taskValidations.urlID,
  validationResponse,
  TaskController.getTasksByProject
);
router.get(
  "/:projectID/tasks/:taskID",
  taskValidations.urlID,
  taskValidations.taskID,
  validationResponse,
  TaskController.getTaskById
);
router.put(
  "/:projectID/tasks/:taskID",
  hasAuthorization,
  taskValidations.urlID,
  taskValidations.taskID,
  taskValidations.taskValidator,
  validationResponse,
  TaskController.updateTask
);
router.delete(
  "/:projectID/tasks/:taskID",
  hasAuthorization,
  taskValidations.urlID,
  taskValidations.taskID,
  validationResponse,
  TaskController.deleteTaskById
);
router.post(
  "/:projectID/tasks/:taskID/status",
  taskValidations.urlID,
  taskValidations.taskID,
  taskValidations.taskStatus,
  validationResponse,
  TaskController.updateStatus
);
/** Routes for teams */
router.post(
  "/:projectID/team/find",
  teamtValidations.memberValidator,
  validationResponse,
  TeamMemberController.findMemberByEmail
);
router.post(
  "/:projectID/team/",
  teamtValidations.memberIdValidator,
  validationResponse,
  TeamMemberController.addMember
);
router.delete(
  "/:projectID/team/:userId",
  teamtValidations.memberIdURLValidator,
  validationResponse,
  TeamMemberController.removeMember
);
router.get(
  "/:projectID/team/",
  TeamMemberController.getProyectMemmbers
);
/** Routes for Notes */
router.post(
  '/:projectID/tasks/:taskID/notes',
  taskValidations.taskNote,
  validationResponse,
  NoteController.createNote
)
router.get(
  '/:projectID/tasks/:taskID/notes',
  NoteController.getNotes
)
router.delete(
  '/:projectID/tasks/:taskID/notes/:noteID',
  taskValidations.noteID,
  validationResponse,
  NoteController.removeNote
)
export default router;
