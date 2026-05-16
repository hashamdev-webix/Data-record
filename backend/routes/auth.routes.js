import express from "express";
import { login, getUsers, createUser, deleteUser, updateCredentials } from "../controllers/auth.controller.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.get("/users", protect, adminOnly, getUsers);
router.post("/users", protect, adminOnly, createUser);
router.put("/users/:id/credentials", protect, adminOnly, updateCredentials);
router.delete("/users/:id", protect, adminOnly, deleteUser);

export default router;
