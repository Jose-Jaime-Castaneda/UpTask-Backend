import { type Request, type Response } from "express";
import Note, { INote } from "../models/Note";
import { Types } from "mongoose";

type NoteParams = {
  noteID: Types.ObjectId;
};

export class NoteController {
  static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
    const { content } = req.body;

    const note = new Note();
    note.content = content;
    note.createdBy = req.user.id;
    note.task = req.task.id;

    req.task.notes.push(note.id);

    try {
      await note.save();
      await req.task.save();

      res.send("Nota agregada");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getNotes = async (req: Request, res: Response) => {
    try {
      const notes = await Note.find({ task: req.task.id });

      res.send(notes);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static removeNote = async (req: Request<NoteParams>, res: Response) => {
    try {
      const { noteID } = req.params;
      const notes = await Note.findById(noteID);
      if (!notes) {
        return res.status(404).json({ error: "Nota no encontrada" });
      }

      if (notes.createdBy.toString() !== req.user.id.toString()) {
        return res.status(409).json({ error: "No autorizado" });
      }

      req.task.notes = req.task.notes.filter((note) => note._id.toString() !== notes.id.toString());

      await notes.deleteOne();
      await req.task.save()

      res.send("Nota eliminada");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
