import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
const router = express.Router();
import {
  createEntry,
  updateEntry,
  deleteEntry,
  getEntriesByTag,
  getEntryById,
  getAllEntries,
} from "../controllers/entry.controller.js";
router.use(authMiddleware);

router.post("/create", createEntry);
router.get("/all", getAllEntries);
router.get("/detail/:id", getEntryById);
router.put("/update/:id", updateEntry);
router.delete("/delete/:id", deleteEntry);
router.get("/getBy/:tagname", getEntriesByTag);

export default router;
