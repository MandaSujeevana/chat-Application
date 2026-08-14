import express from "express";
import { checkAuth, syncUser } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/check", protectRoute, checkAuth);
router.post("/sync", syncUser);

export default router;