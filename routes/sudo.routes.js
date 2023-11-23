import { Router } from "express";
import { authUser } from "../middlewares/auth.js";
import { 
    getSudoUsers,
    getSudoUser,
    updatePassword,
    addAdmin,
    getAdminUsers,
    deleteAdmin,
    accessProfile,
    login,
    olvidePassword,
    updateAdmin } from "../controllers/sudo.controllers.js";

const router = Router()

// Querys and mutations of Sudo users
router.get("/users/:sudoId", getSudoUsers)
router.get("/user/:sudoId", getSudoUser)
router.post("/login", login)
router.get("/profile",authUser, accessProfile)
router.post("/olvide-password", olvidePassword)
router.patch("/update-password/:sudoId", updatePassword)


// Querys and mutations of Admin users
router.get("/admin/:sudoId", getAdminUsers)
router.post("/admin/:sudoId/:geo", addAdmin)

router.route("/admin/:adminId/:sudoId")
    .put(updateAdmin)
    .delete(deleteAdmin)


export default router