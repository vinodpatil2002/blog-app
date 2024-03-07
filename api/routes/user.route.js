import express from "express";
import { test,updateUser,deleteUser,signOut,getUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);

router.put("/update/:userId",verifyToken,updateUser);
router.delete("/delete/:userId",verifyToken,deleteUser);
router.post("/signout", signOut);
router.get("/getusers",verifyToken,getUser);


export default router;