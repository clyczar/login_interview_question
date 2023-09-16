import { login, register, reset } from "../controller/auth.js";
import express from "express"

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/reset", reset)

export default router