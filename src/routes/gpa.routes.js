const express = require("express")

const router = express.Router()
const protect = require("../middleware/auth.middleware")
const {

    createCourse,

    getCourses,
    updateCourse,
    deleteCourse

} = require("../controllers/gpa.controller")

router.post("/courses", protect, createCourse)

router.get("/courses", protect, getCourses)

router.put("/courses/:id", protect, updateCourse)

router.delete("/courses/:id", protect, deleteCourse)

module.exports = router