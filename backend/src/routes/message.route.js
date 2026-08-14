import express from "express";
import { 
    getConversationsForSidebar,
    getMessages,
    getUsersForSidebar,
    sendMessage,
 } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";


const router = express.Router();

router.use(protectRoute);

const handleUpload = (req, res, next) => {
  upload.single("media")(req, res, (err) => {
    if (err) {
      console.error("Upload middleware error:", err.message);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

router.get("/users", getUsersForSidebar);
router.get("/conversations", getConversationsForSidebar);
router.get("/:id", getMessages);
router.post("/send/:id", handleUpload, sendMessage);
export default router;