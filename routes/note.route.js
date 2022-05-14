const express = require("express");
const router = express.Router();
const note = require("../controllers/note.controller");

router.post("/",note.createNote);

router.get("/",note.getNotes);

router.get("/:noteId",note.getNoteId);

router.put("/",note.updateNote);

router.delete("/:noteId",note.deleteNote);

module.exports = router;