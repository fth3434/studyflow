const express = require("express")
const router = express.Router()

const {
    register,
    login,
    logout,
    updatePassword
} = require("../controllers/auth.controller")

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.put("/update-password", require("../middleware/auth.middleware"), updatePassword)

module.exports = router
